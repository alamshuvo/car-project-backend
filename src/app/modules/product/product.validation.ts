import { z } from 'zod';

const createProductSchema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    // Add your validation schema here
  }),
});

export const productValidations = {
  createProductSchema,
  updateProductSchema,
};
