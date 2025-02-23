import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    //* create Review schema
    productId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    //* update Review schema
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidations = {
  createReviewSchema,
  updateReviewSchema,
};
