import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
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
