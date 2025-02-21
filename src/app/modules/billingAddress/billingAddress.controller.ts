import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BillingAddressServices } from './billingAddress.service';

const createOne = catchAsync(async (req, res) => {
  const result = await BillingAddressServices.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing address created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await BillingAddressServices.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing address retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await BillingAddressServices.getOneFromDB(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing address retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await BillingAddressServices.updateOneIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing address updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await BillingAddressServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing address deleted successfully',
    data: result,
  });
});

export const BillingAddressControllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
