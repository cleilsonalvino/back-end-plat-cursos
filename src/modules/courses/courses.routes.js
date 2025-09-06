import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';
import { list, bySlug, create, qSchema, createSchema } from './courses.controller.js';

const r = Router();
r.get('/cursos', validate(qSchema), list);
r.get('/:slug', bySlug);
r.post('/', auth, requireRole('INSTRUCTOR', 'ADMIN'), validate(createSchema), create);
export default r;
