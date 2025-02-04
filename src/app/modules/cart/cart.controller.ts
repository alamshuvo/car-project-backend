import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CartServices } from './cart.service';

const addToCart = catchAsync(async (req, res) => {
  const result = await CartServices.addToCart(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart created successfully',
    data: result,
  });
});

const getCart = catchAsync(async (req, res) => {
  const result = await CartServices.getOneFromDB(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

const removeFromCart = catchAsync(async (req, res) => {
  const result = await CartServices.removeProductFromCart(
    req.params.productId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart items removed successfully',
    data: result,
  });
});

const clearCart = catchAsync(async (req, res) => {
  const result = await CartServices.clearCart(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart cleared successfully',
    data: result,
  });
});

export const CartControllers = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
