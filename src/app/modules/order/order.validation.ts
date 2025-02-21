import { z } from 'zod';
import { orderStatuses } from './order.interface';

const createOrderSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z.string(),
        quantity: z.number().min(1),
        color: z.string(),
      }),
    ),
    customerName: z
      .string({ required_error: 'Customer name is required!' })
      .min(1, { message: 'Please enter a valid name!' }),
    customerAddress: z
      .string({ required_error: 'Address is required!' })
      .min(1, { message: 'Please enter a valid address!' }),
    customerPhone: z
      .string({ required_error: 'Phone number is required!' })
      .regex(/^\+880\d{10}$/, 'Please enter a valid phone number!'),
    customerCity: z
      .string({ required_error: 'City is required!' })
      .min(1, { message: 'Please enter a valid city name!' }),
    customerPostCode: z
      .string({ required_error: 'Post code is required!' })
      .min(1, { message: 'Please enter a postcode!' }),
  }),
});

const updateOrderSchema = z.object({
  body: z.object({
    products: z
      .array(
        z.object({
          product: z.string(),
          quantity: z.number().min(1),
          color: z.string(),
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
