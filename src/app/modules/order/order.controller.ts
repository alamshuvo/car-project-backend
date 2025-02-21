import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOne = catchAsync(async (req, res) => {
  const user = req.user;
  let clientIp = req.ip || req.headers['x-forwarded-for'];
  if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
    clientIp = '127.0.0.1';
  }
  const result = await OrderServices.createOneIntoDB(
    req.body,
    user,
    clientIp as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.getAllFromDB(req.query, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrderServices.getOneFromDB(req.params.id, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await OrderServices.updateOneIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const result = await OrderServices.changeStatusOfOrderIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const OrderControllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  updateStatus,
  deleteOne,
};
