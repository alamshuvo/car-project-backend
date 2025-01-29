import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

// creates a new user to database
const createUserIntoDB = async (payload: TUser) => {
  const userExists = await User.isUserExistByEmail(payload.email);
  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  const result = await User.create(payload);
  if (result) {
    return await User.findById(result._id).select('name email');
  }
  return result;
};

const updateUserIntoDB = async (payload: Partial<TUser>) => {
  const result = await User.create(payload);
  return result;
};

/**
 * Deletes a user from the database.
 * @param id - The ID of the user to delete.
 * @returns The deleted user.
 * @throws AppError - 404 if the user doesn't exist.
 */
const deleteUserFromDB = async (id: string) => {
  // Check if the user exists
  const user = await User.isUserExist(id);
  if (!user) {
    // If the user doesn't exist, throw a 404 error
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This user doesn't exist, so we can't delete them",
    );
  }

  // Find the user by ID and update their isBlocked field to true
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true },
  );

  return deletedUser;
};

/**
 * Blocks a user in the database.
 * @param id - The ID of the user to block.
 * @returns The blocked user.
 * @throws AppError - 404 if the user doesn't exist.
 */
const blockUserInDB = async (id: string) => {
  // Check if the user exists
  const user = await User.isUserExist(id);
  if (!user) {
    // If they don't, throw a 404 error
    throw new AppError(httpStatus.NOT_FOUND, "This user doesn't exist");
  }

  // Find the user by ID and update their isBlocked field to true
  const blockedUser = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true, runValidators: true },
  );

  return blockedUser;
};

export const UserServices = {
  createUserIntoDB,
  updateUserIntoDB,
  deleteUserFromDB,
  blockUserInDB,
};
