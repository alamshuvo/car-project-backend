import { z } from 'zod';

const createOrderSchema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

export const orderValidations = {
  createOrderSchema,
  updateOrderSchema,
};
