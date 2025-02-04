import { JwtPayload } from 'jsonwebtoken';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { User } from '../user/user.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { Order } from '../order/order.model';
import { OrderStatuses } from '../order/order.constant';
import { Product } from '../product/product.model';
import { reviewSearchableFields } from './review.constant';
import QueryBuilder from '../../builder/QueryBuilder';

const createOneIntoDB = async (
  payload: IReview,
  userJWTDecoded: JwtPayload,
): Promise<IReview> => {
  // check if user exists
  const user = await User.isUserExistByEmail(userJWTDecoded.email);
  if (!user?._id) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const product = await Product.findById(payload.productId);
  if (!product) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');

  // check if user has a completed order with this product
  const hasPurchased = Order.findOne({
    user: user._id,
    'products.productId': payload.productId,
    status: OrderStatuses.delivered,
  });
  if (!hasPurchased)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have not purchased this product!',
    );

  // check if user already reviewed
  const reviewed = await Review.findOne({
    productId: payload.productId,
    userId: user._id,
    isDeleted: false,
  });

  if (reviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You've already reviewed this product!",
    );
  }

  const reviewPayload = {
    productId: payload.productId,
    rating: payload.rating,
    comment: payload.comment ?? '',
    userId: user._id,
  };

  const result = await Review.create(reviewPayload);
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Review.find(), query);

  queryBuilder
    .search(reviewSearchableFields)
    // .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    meta,
    result,
  };
};

const getOneFromDB = async (id: string): Promise<IReview | null> => {
  const result = await Review.findById(id);
  return result;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IReview>,
  userJWTDecoded: JwtPayload,
): Promise<IReview | null> => {
  // Check if user exists
  const user = await User.isUserExistByEmail(userJWTDecoded.email);
  if (!user?._id) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  // Find the existing review
  const review = await Review.findById(id);
  if (!review) throw new AppError(httpStatus.NOT_FOUND, 'Review not found!');

  // Ensure the user is the owner of the review
  if (review.userId.toString() !== user._id.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own review!',
    );
  }

  // Check if the product exists
  const product = await Product.findById(review.productId);
  if (!product) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');

  // Update the review
  const updatedReview = await Review.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedReview;
};

const deleteOneFromDB = async (id: string): Promise<IReview | null> => {
  const result = await Review.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ReviewServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
