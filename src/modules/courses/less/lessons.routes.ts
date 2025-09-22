import { Router } from 'express';
import { validate } from '../../../middlewares/validate.js';
import { auth } from '../../../middlewares/auth.js';
import { requireRole } from '../../../middlewares/rbac.js';
import { createLesson, listLessonsByModule, lessonSchema } from './lessons.controller.js';

const r = Router();

// Criar lição (instrutor/admin)
r.post('/create', auth, requireRole('INSTRUCTOR', 'ADMIN'), validate(lessonSchema), createLesson);

// Listar lições (pelo moduleId no body)
r.post('/list', auth, listLessonsByModule);


export default r;
