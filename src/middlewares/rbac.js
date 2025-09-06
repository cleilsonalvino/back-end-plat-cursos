export const requireRole = (...roles) => (req, _res, next) => {
  const role = req.user?.role;
  if (!role || !roles.includes(role)) return next({ status: 403, code: 'FORBIDDEN', message: 'Permissão insuficiente' });
  next();
};
