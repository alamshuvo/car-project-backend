import { z } from 'zod';

const cartProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  color: z.string().optional(),
});

const createCartSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    products: z
      .array(cartProductSchema)
      .nonempty('Cart must have at least one product'),
    totalPrice: z.number().min(0, 'Total price must be at least 0'),
  }),
});

const updateCartSchema = z.object({
  body: z.object({
    products: z.array(cartProductSchema).optional(),
    totalPrice: z.number().min(0, 'Total price must be at least 0').optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const CartValidations = {
  createCartSchema,
  updateCartSchema,
};
