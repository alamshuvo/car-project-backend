import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    // Add your schema fields here
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
