import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as PaymentService from './payment.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

export const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

export const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.verifyPayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment verified successfully',
    data: result,
  });
});

export const checkStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.checkPaymentStatus(req.body.order_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment status retrieved successfully',
    data: result,
  });
});

export const getAllPayments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.getAllFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments retrieved successfully',
      data: result,
    });
  },
);

export const PaymentControllers = {
  createPayment,
  verifyPayment,
  checkStatus,
  getAllPayments,
};
