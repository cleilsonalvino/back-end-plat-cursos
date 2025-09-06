export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!parsed.success) {
    const issues = parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
    return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Dados inválidos', details: issues });
  }
  Object.assign(req, parsed.data);
  next();
};
