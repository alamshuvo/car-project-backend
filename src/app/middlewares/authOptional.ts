import { Request, Response, NextFunction } from 'express';
import auth from './auth';

const authOptional = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization || req.cookies.token;
  if (token) {
    return auth('user')(req, res, next);
  }
  return next();
};

export default authOptional;
