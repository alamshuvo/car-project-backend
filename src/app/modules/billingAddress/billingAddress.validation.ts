import { z } from 'zod';

const createBillingAddressSchema = z.object({
  body: z.object({
    customerName: z
      .string({ required_error: 'Name is required!' })
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

const updateBillingAddressSchema = z.object({
  body: z.object({
    customerName: z.string().optional(),
    customerAddress: z.string().optional(),
    customerPhone: z.string().optional(),
    customerCity: z.string().optional(),
    customerPostCode: z.string().optional(),
  }),
});

export const BillingAddressValidations = {
  createBillingAddressSchema,
  updateBillingAddressSchema,
};
