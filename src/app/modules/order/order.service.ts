import { JwtPayload } from 'jsonwebtoken';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import AppError from '../../error/AppError';
import { startSession, Types, UpdateQuery } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { orderSearchableFields } from './order.constant';
import httpStatus from 'http-status';
import { IProduct } from '../product/product.interface';
import { generateOrderId } from './order.utils';
import { BillingAddress } from '../billingAddress/billingAddress.model';
import { Payment } from '../payment/payment.model';

const createOneIntoDB = async (
  payload: {
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerCity: string;
    customerPostCode: string;
  } & IOrder,
  userJWTDecoded: JwtPayload,
  clientIp: string,
): Promise<IOrder | undefined> => {
  //* map the product ids with quantity
  const productRequests = payload.products.reduce(
    (map, { product, quantity }) => {
      map.set(product.toString(), quantity);
      return map;
    },
    new Map<string, number>(),
  );
  //* find actual products from database
  const products = await Product.find({
    _id: { $in: [...productRequests.keys()] },
  });

  //* check if all product available in the database
  if (productRequests.size !== products.length)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Some or all products are not available!',
    );

  let totalPrice = 0;

  //* check if the requested quantity available
  const insufficientStock = products.filter((product) => {
    const quantity = productRequests.get(product._id.toString()) as number;
    totalPrice += product.price * quantity;
    return product.stock < quantity || 0;
  });

  if (insufficientStock.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient stock for products: ${insufficientStock.map((p) => p.name).join(', ')}`,
    );
  }

  const user = await User.isUserExistByEmail(userJWTDecoded.email);
  if (!user?._id) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const session = await startSession();
  try {
    session.startTransaction();
    //* create the order
    const result = await Order.create({
      orderId: await generateOrderId(),
      userId: user._id,
      totalPrice,
      products: payload.products,
      status: 'pending',
    });
    if (result) {
      //* update the products quantity
      const bulkUpdateOperations = payload.products.map(
        ({ product, quantity }) => ({
          updateOne: {
            filter: { _id: product },
            update: { $inc: { stock: -quantity } },
          },
        }),
      );

      await Product.bulkWrite(bulkUpdateOperations);

      //* create billing address
      await BillingAddress.create({
        orderId: result._id,
        userId: user._id,
        currency: 'BDT',
        customerAddress: payload.customerAddress,
        customerCity: payload.customerCity,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerPostCode: payload.customerPostCode,
        clientIp,
      });
    }

    await session.commitTransaction();
    await session.endSession();

    return await result.populate('products.product');
  } catch {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong!',
    );
  }
};
const getAllFromDB = async (
  query: Record<string, unknown>,
  userJWTDecoded: JwtPayload,
) => {
  const user = await User.isUserExistByEmail(userJWTDecoded.email);
  if (!user?._id)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to view this!',
    );

  let find = {};
  if (user.role === 'user') find = { userId: user._id };

  const queryBuilder = new QueryBuilder(Order.find(find), query);
  queryBuilder
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await queryBuilder.modelQuery.populate('products.product');
  const meta = await queryBuilder.countTotal();
  return {
    meta,
    data,
  };
};

const getOneFromDB = async (id: string, userJWTDecoded: JwtPayload) => {
  const user = await User.isUserExistByEmail(userJWTDecoded.email);
  if (!user?._id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not authorized to view this!',
    );
  }

  const result = await Order.findById(id)
    .populate('products.product')
    .populate('userId', 'name email')
    .lean();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  // Check if the user has permission to view the order
  if (
    user.role === 'user' &&
    result?.userId._id.toString() !== user._id.toString()
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Order not found!');
  }

  // Fetch Payment Details using orderId
  const payment = await Payment.findOne({ orderId: result.orderId }).lean();

  // Fetch Billing Address using orderId
  const billingAddress = await BillingAddress.findOne({
    orderId: result._id,
  }).lean();

  return {
    ...result,
    paymentDetails: payment || null,
    billingAddress: billingAddress || null,
  };
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IOrder>,
): Promise<IOrder | null> => {
  const session = await startSession();
  try {
    session.startTransaction();

    // Find the existing order
    const existingOrder = await Order.findById(id).session(session);
    if (!existingOrder)
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');

    // If products are updated, check stock and adjust accordingly
    if (payload.products && payload.products.length > 0) {
      //* Map requested product quantities
      const productRequests = new Map<string, number>();
      payload.products.forEach(({ product, quantity }) => {
        productRequests.set(product.toString(), quantity);
      });

      //* Fetch product details
      const products = await Product.find({
        _id: { $in: [...productRequests.keys()] },
      }).session(session);

      //* Check if all products exist
      if (productRequests.size !== products.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Some or all products are not available!',
        );
      }

      //* Validate stock availability
      const insufficientStock = products.filter((product) => {
        const requestedQty = productRequests.get(
          product._id.toString(),
        ) as number;
        return product.stock < requestedQty || 0;
      });

      if (insufficientStock.length > 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for products: ${insufficientStock.map((p) => p.name).join(', ')}`,
        );
      }

      //* Adjust stock accordingly (revert old stock, apply new stock)
      const bulkUpdateOperations: {
        updateOne: {
          filter: { _id: Types.ObjectId };
          update: UpdateQuery<IProduct>;
        };
      }[] = [];

      // Revert previous stock
      existingOrder.products.forEach(({ product, quantity }) => {
        bulkUpdateOperations.push({
          updateOne: {
            filter: { _id: product },
            update: { $inc: { stock: quantity } }, // Add back previous stock
          },
        });
      });

      // Deduct new stock
      payload.products.forEach(({ product, quantity }) => {
        bulkUpdateOperations.push({
          updateOne: {
            filter: { _id: product },
            update: { $inc: { stock: -quantity } }, // Reduce new stock
          },
        });
      });

      if (bulkUpdateOperations.length > 0) {
        await Product.bulkWrite(bulkUpdateOperations, { session });
      }
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(id, payload, {
      new: true,
    }).session(session);

    await session.commitTransaction();
    await session.endSession();

    return updatedOrder;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // eslint-disable-next-line no-console
    console.log(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong while updating the order!',
    );
  }
};

const changeStatusOfOrderIntoDB = async (
  id: string,
  payload: Pick<IOrder, 'status'>,
): Promise<IOrder | null> => {
  const session = await startSession();
  session.startTransaction();
  try {
    // Find the order with its products
    const order = await Order.findById(id).session(session).lean();
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === 'cancelled') {
      throw new AppError(httpStatus.BAD_REQUEST, 'Order is already cancelled!');
    }

    // Determine if stock should be increased or decreased
    const isCancelling = payload.status === 'cancelled';

    // Prepare stock updates
    const stockUpdates = order.products.map(({ product, quantity }) => ({
      updateOne: {
        filter: { _id: product },
        update: { $inc: { stock: isCancelling ? quantity : -quantity } },
      },
    }));

    // Apply stock updates using bulkWrite within session
    await Product.bulkWrite(stockUpdates, { session });

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: payload.status },
      { runValidators: true, new: true, session },
    ).lean();

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return updatedOrder;
  } catch {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update order status',
    );
  }
};

const deleteOneFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const OrderServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  changeStatusOfOrderIntoDB,
  deleteOneFromDB,
};
