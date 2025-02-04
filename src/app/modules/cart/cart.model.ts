import { model, Schema } from 'mongoose';
import { ICart } from './cart.interface';

const cartSchema = new Schema<ICart>(
  {
    //* cart schema fields
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        color: { type: String, required: false },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
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
cartSchema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
cartSchema.post('save', function (doc, next) {
  next();
});

cartSchema.pre('updateOne', async function (next) {
  next();
});
export const Cart = model<ICart>('Cart', cartSchema);
