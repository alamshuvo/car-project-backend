import { Types } from 'mongoose';

export interface IBillingAddress {
  //* billingAddress interface properties
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  customerName: string;
  customerAddress: string;
  clientIp: string;
  customerPhone: string;
  currency: string;
  customerCity: string;
  customerPostCode: string;
  isDeleted: boolean;
}
