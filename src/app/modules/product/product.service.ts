import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Order } from '../order/order.model';
import { productSearchableFields } from './product.constant';
import { IProduct } from './product.interface';
import { Product } from './product.model';

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
  const data = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return {
    meta,
    data,
  };
};

const getTopProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query);
  productQuery
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();
  return {
    meta,
    data,
  };
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
  const products = await Product.find({ _id: { $in: productIds } });

  return products;
};

const getOneFromDB = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id);
  return result;
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
