import { Model } from 'mongoose';

export type TUserRole = 'user' | 'admin';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isBlocked: boolean;
  isDeleted: boolean;
  passwordUpdatedAt?: Date;
}

export interface TUserModel extends Model<TUser> {
  isUserExist(id: string): Promise<TUser | null>;
  isUserExistByEmail(email: string): Promise<TUser | null>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  isUserBlocked(userId: string): Promise<boolean>;
  isUserDeleted(userId: string): Promise<boolean>;
}
