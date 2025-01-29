import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      default: [],
      required: false,
    },
    ratings: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// pre save middleware/hook
productSchema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
productSchema.post('save', function (doc, next) {
  next();
});

productSchema.pre('updateOne', async function (next) {
  next();
});
export const Product = model<IProduct>('Product', productSchema);
