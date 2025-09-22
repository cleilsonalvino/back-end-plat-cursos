import { Request, Response, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';

export const validate = (schema: z.ZodSchema<any>) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!parsed.success) {
    const details = parsed.error.issues.map((i: ZodIssue) => ({
      path: i.path.join('.'),
      message: i.message
    }));
    return next({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Dados inválidos',
      details
    });
  }

  // Não tocar em req.body/query/params (Express 5 são getters).
  // Usar um campo nosso:
  req.validated = parsed.data;
  next();
};