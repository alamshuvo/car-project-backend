import { Types } from 'mongoose';

export interface IReview {
  //* review interface properties
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
}
