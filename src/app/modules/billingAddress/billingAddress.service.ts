import { JwtPayload } from 'jsonwebtoken';
import { IBillingAddress } from './billingAddress.interface';
import { BillingAddress } from './billingAddress.model';
import { User } from '../user/user.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createOneIntoDB = async (
  payload: IBillingAddress,
): Promise<IBillingAddress> => {
  const result = await BillingAddress.create(payload);
  return result;
};

const getAllFromDB = async (): Promise<IBillingAddress[]> => {
  const result = await BillingAddress.find();
  return result;
};

const getOneFromDB = async (
  userJWTDecoded: JwtPayload,
): Promise<IBillingAddress | null> => {
  const user = await User.isUserExistByEmail(userJWTDecoded.email);
  console.log(user);
  if (!user || !(user.role === 'user'))
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to view this!',
    );
  const result = await BillingAddress.findOne({ userId: user._id });
  return result;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IBillingAddress>,
): Promise<IBillingAddress | null> => {
  const result = await BillingAddress.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOneFromDB = async (id: string): Promise<IBillingAddress | null> => {
  const result = await BillingAddress.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const BillingAddressServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
