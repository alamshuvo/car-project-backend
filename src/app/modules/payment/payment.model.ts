import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
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
paymentSchema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
paymentSchema.post('save', function (doc, next) {
  next();
});

paymentSchema.pre('updateOne', async function (next) {
  next();
});
export const Payment = model<IPayment>('Payment', paymentSchema);
