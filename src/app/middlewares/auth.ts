import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import AuthError from '../error/AuthError';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AuthError('Not logged in!');
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { email, role } = decoded;
    const user = await User.isUserExistByEmail(email);
    if (!user) {
      throw new AuthError('Invalid access token!');
    }
    if (user.isDeleted) {
      throw new AuthError('Invalid access token!');
    }
    if (user.isBlocked) {
      throw new AuthError('You have been blocked!!');
    }
    if (!requiredRoles.includes(role)) {
      throw new AuthError('You are not allowed to access this route!!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
