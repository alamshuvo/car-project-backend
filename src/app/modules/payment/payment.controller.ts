import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';

const createOne = catchAsync(async (req, res) => {
  const result = await paymentServices.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await paymentServices.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await paymentServices.getOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await paymentServices.updateOneIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await paymentServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment deleted successfully',
    data: result,
  });
});

export const paymentControllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
