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

const createOneIntoDB = async (
  payload: IOrder,
  userJWTDecoded: JwtPayload,
): Promise<IOrder | undefined> => {
  //* map the product ids with quantity
  const productRequests = payload.products.reduce(
    (map, { productId, quantity }) => {
      map.set(productId.toString(), quantity);
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
      user: user._id,
      totalPrice,
      products: payload.products,
      status: 'pending',
    });
    if (result) {
      //* update the products quantity
      const bulkUpdateOperations = payload.products.map(
        ({ productId, quantity }) => ({
          updateOne: {
            filter: { _id: productId },
            update: { $inc: { stock: -quantity } },
          },
        }),
      );

      await Product.bulkWrite(bulkUpdateOperations);
    }

    await session.commitTransaction();
    await session.endSession();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong!',
    );
  }
};
const getAllFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Order.find(), query);
  queryBuilder
    .search(orderSearchableFields)
    // .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return {
    meta,
    result,
  };
};

const getOneFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id);
  return result;
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
      payload.products.forEach(({ productId, quantity }) => {
        productRequests.set(productId.toString(), quantity);
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
      existingOrder.products.forEach(({ productId, quantity }) => {
        bulkUpdateOperations.push({
          updateOne: {
            filter: { _id: productId },
            update: { $inc: { stock: quantity } }, // Add back previous stock
          },
        });
      });

      // Deduct new stock
      payload.products.forEach(({ productId, quantity }) => {
        bulkUpdateOperations.push({
          updateOne: {
            filter: { _id: productId },
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
  // Check if order exists
  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  // Update order status
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: payload.status },
    { runValidators: true, new: true },
  ).lean();

  return updatedOrder;
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
