import { IProduct } from './product.interface';
import { Product } from './product.model';

const createOneIntoDB = async (payload: IProduct): Promise<IProduct> => {
  const result = await Product.create(payload);
  return result;
};

const getAllFromDB = async (): Promise<IProduct[]> => {
  const result = await Product.find();
  return result;
};

const getOneFromDB = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id);
  return result;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IProduct>
): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteOneFromDB = async (id: string): Promise<IProduct | null> => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const productServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
