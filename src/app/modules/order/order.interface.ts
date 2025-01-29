import { Types } from 'mongoose';
export const orderStatuses = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

interface IOrderProduct {
  productId: Types.ObjectId; // Reference to Product model
  quantity: number;
}

export interface IOrder {
  user: Types.ObjectId; // Reference to User model
  products: IOrderProduct[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
