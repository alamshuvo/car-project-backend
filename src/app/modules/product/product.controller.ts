import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createOne = catchAsync(async (req, res) => {
  const result = await ProductServices.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getTopProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getTopProductsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await ProductServices.getOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await ProductServices.updateOneIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  await ProductServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
});

export const ProductControllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getTopProducts,
};
