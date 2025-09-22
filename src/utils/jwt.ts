import jwt from 'jsonwebtoken';

export const signAccess = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  const options: jwt.SignOptions = { expiresIn: process.env.JWT_EXPIRES || '15m', algorithm: 'HS256' };
  return jwt.sign(payload, secret, options);
}

export const signRefresh = (payload: object) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  const options: jwt.SignOptions = { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d', algorithm: 'HS256' };
  return jwt.sign(payload, secret, options);
}

export const verifyAccess = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, secret);
}
export const verifyRefresh = (token: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  return jwt.verify(token, secret);
}
