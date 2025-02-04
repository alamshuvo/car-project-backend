import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
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
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
