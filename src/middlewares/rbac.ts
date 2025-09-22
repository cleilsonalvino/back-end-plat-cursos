import { Request, Response, NextFunction } from 'express';

export const requireRole = (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (!role || !roles.includes(role)) return next({ status: 403, code: 'FORBIDDEN', message: 'Permissão insuficiente' });
  next();
};
