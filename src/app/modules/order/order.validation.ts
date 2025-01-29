import { z } from 'zod';
import { orderStatuses } from './order.interface';

const createOrderSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      }),
    ),
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    products: z
      .array(
        z.object({
          productId: z.string(),
          quantity: z.number().min(1),
        }),
      )
      .optional(),
    status: z.enum([...orderStatuses] as [string, ...string[]]).optional(),
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([...orderStatuses] as [string, ...string[]]),
  }),
});

export const OrderValidations = {
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
};
