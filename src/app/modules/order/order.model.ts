import { model, Schema } from 'mongoose';
import { IOrder, orderStatuses } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: orderStatuses,
      default: 'pending',
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
orderSchema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
orderSchema.post('save', function (doc, next) {
  next();
});

orderSchema.pre('updateOne', async function (next) {
  next();
});
export const Order = model<IOrder>('Order', orderSchema);
