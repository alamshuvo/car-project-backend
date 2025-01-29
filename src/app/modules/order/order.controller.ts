import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderServices } from './order.service';

const createOne = catchAsync(async (req, res) => {
  const result = await orderServices.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await orderServices.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await orderServices.getOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await orderServices.updateOneIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await orderServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const orderControllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
