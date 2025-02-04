import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { ICart, ICartProduct } from './cart.interface';
import { Cart } from './cart.model';
import { JwtPayload } from 'jsonwebtoken';
import { Product } from '../product/product.model';

const addToCart = async (
  payload: ICartProduct[],
  userJWTDecoded: JwtPayload,
): Promise<ICart> => {
  if (!userJWTDecoded || !userJWTDecoded.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'User authentication required.',
    );
  }

  if (!payload || payload.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cart must have at least one product.',
    );
  }

  // Fetch product prices to calculate total
  const productIds = payload.map((p) => p.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== payload.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Some products are invalid or not found.',
    );
  }

  // Check if the user already has a cart
  const existingCart = await Cart.findOne({ userId: userJWTDecoded.userId });

  if (existingCart) {
    payload.forEach((newProduct) => {
      const existingProductIndex = existingCart.products.findIndex(
        (p) => p.productId.toString() === newProduct.productId.toString(),
      );

      if (existingProductIndex !== -1) {
        // Update quantity if product already exists
        existingCart.products[existingProductIndex].quantity +=
          newProduct.quantity;
      } else {
        // Add new product to cart
        existingCart.products.push(newProduct);
      }
    });

    // Recalculate total price
    existingCart.totalPrice = existingCart.products.reduce(
      (sum, cartProduct) => {
        const productData = products.find(
          (p) => p._id.toString() === cartProduct.productId.toString(),
        );
        return sum + (productData?.price || 0) * cartProduct.quantity;
      },
      0,
    );

    const updatedCart = await existingCart.save();
    return updatedCart;
  } else {
    // Calculate total price for new cart
    const totalPrice = payload.reduce((sum, cartProduct) => {
      const productData = products.find(
        (p) => p._id.toString() === cartProduct.productId.toString(),
      );
      return sum + (productData?.price || 0) * cartProduct.quantity;
    }, 0);

    // Create a new cart
    const newCart: ICart = {
      userId: userJWTDecoded.userId,
      products: payload,
      totalPrice,
      isDeleted: false,
    };

    const result = await Cart.create(newCart);
    return result;
  }
};

// Get a single user's cart (Based on Auth)
const getOneFromDB = async (
  userJWTDecoded: JwtPayload,
): Promise<ICart | null> => {
  if (!userJWTDecoded || !userJWTDecoded.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'User authentication required.',
    );
  }

  const cart = await Cart.findOne({ userId: userJWTDecoded.userId }).populate(
    'products.productId',
  );
  if (!cart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found.');
  }
  return cart;
};

const removeProductFromCart = async (
  productId: string,
  userJWTDecoded: JwtPayload,
): Promise<ICart | null> => {
  if (!userJWTDecoded || !userJWTDecoded.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'User authentication required.',
    );
  }

  // Find and update the cart, removing the specified product
  const updatedCart = await Cart.findOneAndUpdate(
    { userId: userJWTDecoded.userId },
    { $pull: { products: { productId } } }, // Remove the specific product
    { new: true },
  );

  if (!updatedCart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found.');
  }

  return updatedCart;
};

const clearCart = async (userJWTDecoded: JwtPayload): Promise<ICart | null> => {
  if (!userJWTDecoded || !userJWTDecoded.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'User authentication required.',
    );
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { userId: userJWTDecoded.userId },
    { $set: { products: [] } },
    { new: true },
  );

  if (!updatedCart) {
    throw new AppError(httpStatus.NOT_FOUND, 'Cart not found.');
  }

  return updatedCart;
};

export const CartServices = {
  addToCart,
  getOneFromDB,
  removeProductFromCart,
  clearCart,
};
