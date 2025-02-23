import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Order } from '../order/order.model';
import { productSearchableFields } from './product.constant';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { User } from '../user/user.model';
import { OrderStatuses } from '../order/order.constant';
import { Review } from '../review/review.model';
import { Types } from 'mongoose';

const getReviewStats = async (productIds: Types.ObjectId[]) => {
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

const createOneIntoDB = async (payload: IProduct): Promise<IProduct> => {
  const result = await Product.create(payload);
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query);
  productQuery
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const products = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  // Get review stats for all products
  const productIds = products.map((product) => product._id);
  const reviewStats = await getReviewStats(productIds);
  const reviewStatsMap = new Map(
    reviewStats.map((stat) => [
      stat._id.toString(),
      { totalReviews: stat.totalReviews, averageRating: stat.averageRating },
    ]),
  );

  const data = products.map((product) => {
    const stats = reviewStatsMap.get(product._id.toString()) || {
      totalReviews: 0,
      averageRating: 0,
    };
    return {
      ...product.toObject(),
      totalReviews: stats.totalReviews,
      averageRating: stats.averageRating,
    };
  });

  return {
    meta,
    data,
  };
};

const getTopProductsFromDB = async () => {
  // Aggregate orders to find top-selling products of all time
  const topSellingProducts = await Order.aggregate([
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.product',
        totalSold: { $sum: '$products.quantity' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 4 },
  ]);

  // Fetch detailed product info from Product collection
  const productIds = topSellingProducts.map((product) => product._id);
  const reviewStats = await getReviewStats(productIds);
  const reviewStatsMap = new Map(
    reviewStats.map((stat) => [
      stat._id.toString(),
      { totalReviews: stat.totalReviews, averageRating: stat.averageRating },
    ]),
  );

  const products = await Product.find({ _id: { $in: productIds } });

  const productsWithStats = products.map((product) => {
    const stats = reviewStatsMap.get(product._id.toString()) || {
      totalReviews: 0,
      averageRating: 0,
    };
    const salesData = topSellingProducts.find(
      (p) => p._id.toString() === product._id.toString(),
    );
    return {
      ...product.toObject(),
      totalSold: salesData ? salesData.totalSold : 0,
      totalReviews: stats.totalReviews,
      averageRating: stats.averageRating,
    };
  });
  return productsWithStats;
};

const getTrendingProductsFromDB = async () => {
  // Calculate the date 30 days ago from now
  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Aggregate orders to find trending products sold in the last 30 days
  const topSellingProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last30Days, $lte: now },
      },
    },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.product',
        totalSold: { $sum: '$products.quantity' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // console.log(topSellingProducts);

  // Fetch detailed product info from Product collection
  const productIds = topSellingProducts.map((product) => product._id);
  const reviewStats = await getReviewStats(productIds);
  const reviewStatsMap = new Map(
    reviewStats.map((stat) => [
      stat._id.toString(),
      { totalReviews: stat.totalReviews, averageRating: stat.averageRating },
    ]),
  );

  const products = await Product.find({ _id: { $in: productIds } });

  const productsWithStats = products.map((product) => {
    const stats = reviewStatsMap.get(product._id.toString()) || {
      totalReviews: 0,
      averageRating: 0,
    };
    const salesData = topSellingProducts.find(
      (p) => p._id.toString() === product._id.toString(),
    );
    return {
      ...product.toObject(),
      totalSold: salesData ? salesData.totalSold : 0,
      totalReviews: stats.totalReviews,
      averageRating: stats.averageRating,
    };
  });
  return productsWithStats;
};

const getOneFromDB = async (id: string, userJWTDecoded: JwtPayload) => {
  const result = await Product.findById(id);
  let hasPurchased = false;
  if (userJWTDecoded) {
    const user = await User.isUserExistByEmail(userJWTDecoded.email);
    // Check if user has a completed order with this product
    if (user) {
      const order = await Order.findOne({
        userId: user._id,
        'products.product': id,
        status: OrderStatuses.delivered,
      });
      hasPurchased = order ? true : false;
    }
  }

  // Get total reviews and average rating
  const reviewStats = await Review.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(id),
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

  const { totalReviews = 0, averageRating = 0 } = reviewStats[0] || {};

  return { result, hasPurchased, totalReviews, averageRating };
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IProduct>,
): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteOneFromDB = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(404, 'Invalid productId.');
  }
  return result;
};

export const ProductServices = {
  createOneIntoDB,
  getAllFromDB,
  getTopProductsFromDB,
  getTrendingProductsFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
