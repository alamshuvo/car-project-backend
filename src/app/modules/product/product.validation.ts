import { z } from 'zod';

const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required!' }),
    brand: z.string({ required_error: 'Brand name is required!' }),
    price: z.number({ required_error: 'Price is required!' }).min(1),
    model: z.string({ required_error: 'Model is required' }),
    stock: z.number({ required_error: 'Price is required!' }).min(0),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().optional(),
    model: z.string().optional(),
    stock: z.number().optional(),
  }),
});

export const ProductValidations = {
  createProductSchema,
  updateProductSchema,
};
