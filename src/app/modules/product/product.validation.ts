import { z } from 'zod';

const productSpecificationsSchema = z.object({
  seatingCapacity: z
    .number({ required_error: 'Seating capacity is required!' })
    .min(1),
  fuelType: z.string({ required_error: 'Fuel type is required!' }),
  mileage: z.string({ required_error: 'Mileage is required!' }),
  hasAC: z.boolean().optional(),
  availableColors: z.array(z.string()).optional(),
});

const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required!' }),
    brand: z.string({ required_error: 'Brand name is required!' }),
    price: z.number({ required_error: 'Price is required!' }).min(1),
    model: z.string({ required_error: 'Model is required!' }),
    stock: z.number({ required_error: 'Stock is required!' }).min(0),
    description: z.string().optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    ratings: z.string().optional(),
    specifications: productSpecificationsSchema,
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    _id: z.string().optional(),
    name: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().min(1).optional(),
    model: z.string().optional(),
    stock: z.number().min(0).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    images: z.array(z.string()).optional(),
    ratings: z.string().optional(),
    specifications: productSpecificationsSchema.partial(),
  }),
});

export const ProductValidations = {
  createProductSchema,
  updateProductSchema,
};
