import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: number | string,
): string => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expiresIn as number });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
