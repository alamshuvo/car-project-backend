// payment.model.ts
import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  },
  spOrderId: {
    type: String,
    required: true,
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String,
    address: String,
  },
  paymentDetails: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Payment = mongoose.model('Payment', paymentSchema);
