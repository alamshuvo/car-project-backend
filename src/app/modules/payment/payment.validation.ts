import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

const updatePaymentSchema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

export const PaymentValidations = {
  createPaymentSchema,
  updatePaymentSchema,
};
