import { model, Schema } from 'mongoose';
import { IBillingAddress } from './billingAddress.interface';

const billingAddressSchema = new Schema<IBillingAddress>(
  {
    //* billingAddress schema fields
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    customerName: { type: String, required: true },
    customerAddress: { type: String, required: true },
    clientIp: { type: String, required: false },
    customerPhone: { type: String, required: true },
    currency: { type: String, required: true },
    customerCity: { type: String, required: true },
    customerPostCode: { type: String, required: true },

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
billingAddressSchema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
billingAddressSchema.post('save', function (doc, next) {
  next();
});

billingAddressSchema.pre('updateOne', async function (next) {
  next();
});
export const BillingAddress = model<IBillingAddress>(
  'BillingAddress',
  billingAddressSchema,
);
