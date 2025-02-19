import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { TLoginPayload } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginPayload) => {
  const { email, password } = payload;
  const user = await User.isUserExistByEmail(email);
  if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

  const isPasswordMatched = await User.comparePassword(password, user.password);
  if (!isPasswordMatched)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');

  if (user.isBlocked)
    throw new AppError(httpStatus.UNAUTHORIZED, 'You have been blocked!');

  if (user.isDeleted)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'This account has been deleted or not exists!',
    );
  const jwtPayload: JwtPayload = {
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId } = decoded;

  // checking if the user is exist
  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
