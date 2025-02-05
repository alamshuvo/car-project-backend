import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string | number,
): string => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
