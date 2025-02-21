/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sp from 'shurjopay';
import { Payment } from './payment.model';
import config from '../../config';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { Order } from '../order/order.model';
import { startSession } from 'mongoose';

const shurjopay = sp();

shurjopay.config(
  config.sp_endpoint as string,
  config.sp_username as string,
  config.sp_password as string,
  config.sp_prefix as string,
  config.sp_return_url as string,
);
export const initiatePayment = async ({ orderId }: { orderId: string }) => {
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
    }
    const payment = await Payment.findOne({ spOrderId: orderId });
    if (payment) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Payment already initiated'!);
    }
    const response: any = await new Promise((resolve, reject) => {
      shurjopay.makePayment(
        {
          amount: 1000,
          order_id: order.orderId,
          customer_name: 'Shanto',
          customer_address: 'Mohakhali',
          client_ip: '102.324.0.5',
          customer_phone: '01517162394',
          currency: 'BDT',
          customer_city: 'Dhaka',
          customer_post_code: '1229',
        },
        (response_data: any) => {
          resolve(response_data);
        },
        (error: any) => {
          reject(error);
        },
      );
    });
    if (response.checkout_url) {
      const payment = await Payment.create({
        orderId: response.customer_order_id,
        amount: response.amount,
        status: 'PENDING',
        spOrderId: response.sp_order_id,
        customerInfo: {
          name: response.customer_name,
          phone: response.customer_phone,
          email: response.customer_email,
          address: response.customer_address,
        },
      });
      if (payment) {
        return response.checkout_url;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error('Payment initiation failed');
  }
};

export const verifyPayment = async (orderId: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const verificationResponse: any = await new Promise((resolve, reject) => {
      shurjopay.verifyPayment(
        orderId,
        (data: any) => resolve(data[0]),
        (err: any) => reject(err),
      );
    });

    const payment = await Payment.findOne(
      { orderId: verificationResponse.customer_order_id },
      null,
      { session },
    );

    if (!payment) {
      throw new Error('Payment record not found');
    }

    const isSuccess = verificationResponse.sp_code === '1000';
    payment.status = isSuccess ? 'SUCCESS' : 'FAILED';
    payment.paymentDetails = verificationResponse;
    payment.updatedAt = new Date();
    await payment.save({ session });

    if (isSuccess) {
      const order = await Order.findOne({ orderId: payment.orderId }, null, {
        session,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      order.status = 'processing';
      await order.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    console.log(
      isSuccess ? 'Payment Status: SUCCESS' : 'Payment Status: FAILED',
    );
    return verificationResponse;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log('Transaction aborted due to:', error);
    throw new Error('Payment verification failed');
  }
};

export const checkPaymentStatus = async (orderId: string) => {
  try {
    return await shurjopay.checkPaymentStatus(orderId);
  } catch (error) {
    console.log(error);
    throw new Error('Payment status check failed');
  }
};

export const getAllFromDB = async () => {
  return Payment.find({}).sort({ createdAt: -1 });
};
