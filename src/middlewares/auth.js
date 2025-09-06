import { verifyAccess } from '../utils/jwt.js';

export function auth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next({ status: 401, code: 'UNAUTHORIZED', message: 'Token ausente' });
  try {
    const payload = verifyAccess(header.slice(7));
    req.user = payload;
    next();
  } catch {
    next({ status: 401, code: 'UNAUTHORIZED', message: 'Token inválido' });
  }
}
