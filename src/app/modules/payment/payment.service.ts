import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const createOneIntoDB = async (payload: IPayment): Promise<IPayment> => {
  const result = await Payment.create(payload);
  return result;
};

const getAllFromDB = async (): Promise<IPayment[]> => {
  const result = await Payment.find();
  return result;
};

const getOneFromDB = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findById(id);
  return result;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IPayment>,
): Promise<IPayment | null> => {
  const result = await Payment.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteOneFromDB = async (id: string): Promise<IPayment | null> => {
  const result = await Payment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const PaymentServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
