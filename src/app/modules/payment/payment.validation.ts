import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({
    orderId: z
      .string({
        required_error: 'Order ID is required',
      })
      .min(1, {
        message: 'Order ID cannot be empty',
      }),
  }),
});

const createPaymentVerificationSchema = z.object({
  body: z.object({
    orderId: z
      .string({
        required_error: 'Order ID is required for verification',
      })
      .min(1, {
        message: 'Order ID cannot be empty',
      }),
  }),
});

export const PaymentValidations = {
  createPaymentSchema,
  createPaymentVerificationSchema,
};
