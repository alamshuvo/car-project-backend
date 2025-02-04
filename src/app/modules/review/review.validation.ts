import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    //* create Review schema
  }),
});

const updateReviewSchema = z.object({
  body: z.object({
    //* update Review schema
  }),
});

export const ReviewValidations = {
  createReviewSchema,
  updateReviewSchema,
};
