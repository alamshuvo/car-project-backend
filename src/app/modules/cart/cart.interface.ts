import { Types } from 'mongoose';

export interface ICartProduct {
  productId: Types.ObjectId;
  quantity: number;
  color: string;
}

export interface ICart {
  userId: Types.ObjectId;
  products: ICartProduct[];
  totalPrice: number;
  isDeleted: boolean;
}
