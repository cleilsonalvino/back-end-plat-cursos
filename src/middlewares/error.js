export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message = err.message ?? 'Erro interno do servidor';
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(status).json({ error: { code, message } });
}
