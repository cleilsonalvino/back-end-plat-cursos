import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt.js';
import { JwtPayload } from 'jsonwebtoken';

export function auth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next({ status: 401, code: 'UNAUTHORIZED', message: 'Token ausente' });
  try {
    const payload = verifyAccess(header.slice(7)) as JwtPayload;
    req.user = {
        sub: payload.sub!,
        role: payload.role!,
    };
    next();
  } catch {
    next({ status: 401, code: 'UNAUTHORIZED', message: 'Token inválido' });
  }
}
