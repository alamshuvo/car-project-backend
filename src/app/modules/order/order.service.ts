import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOneIntoDB = async (payload: IOrder): Promise<IOrder> => {
  const result = await Order.create(payload);
  return result;
};

const getAllFromDB = async (): Promise<IOrder[]> => {
  const result = await Order.find();
  return result;
};

const getOneFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id);
  return result;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IOrder>,
): Promise<IOrder | null> => {
  const result = await Order.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteOneFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const OrderServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
