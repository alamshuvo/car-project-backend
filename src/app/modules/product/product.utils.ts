import { Types } from 'mongoose';
import AppError from '../../error/AppError';
import { Review } from '../review/review.model';
import { Product } from './product.model';

interface SimplifiedProduct {
  _id: string;
  name: string;
  price: number;
  image?: string[];
}
export const getSimilarProducts = async (
  productId: string,
  limit: number = 3,
): Promise<SimplifiedProduct[]> => {
  // Get the reference product first
  const referenceProduct = await Product.findById(productId);

  if (!referenceProduct) {
    throw new AppError(404, 'Reference product not found');
  }

  // Build query conditions for similar products
  const queryConditions = {
    _id: { $ne: productId },
    isDeleted: false,
    price: {
      $gte: referenceProduct.price * 0.8,
      $lte: referenceProduct.price * 1.2,
    },
  };

  // Find similar products with only required fields
  const similarProducts = await Product.find(queryConditions)
    .select('name price images')
    .limit(limit)
    .lean();

  // Transform the data to match required format
  return similarProducts.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    image: product?.images,
  }));
};

// gets review stats for a list of products
export const getReviewStats = async (productIds: Types.ObjectId[]) => {
  return await Review.aggregate([
    {
      $match: {
        productId: { $in: productIds },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: '$productId',
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
};
