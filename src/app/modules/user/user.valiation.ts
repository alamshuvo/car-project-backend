import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    password: z.string({ required_error: 'Password is required' }).optional(),
    isBlocked: z.boolean().optional(),
  }),
});

const UserValidations = {
  updateUserValidationSchema,
};

export default UserValidations;
