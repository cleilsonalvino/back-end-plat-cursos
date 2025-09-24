import { Router } from 'express';
import { validate } from '../../../middlewares/validate.js';
import { auth } from '../../../middlewares/auth.js';
import { requireRole } from '../../../middlewares/rbac.js';
import { createModule, listModulesByCourse, moduleSchema } from './modules.controller.js';

const r = Router();



// Criar módulo (apenas instrutores/admin)
r.post('/create', auth, requireRole('INSTRUCTOR', 'ADMIN'), validate(moduleSchema), createModule);

// Listar módulos de um curso
r.get('/course/:courseId', auth,  listModulesByCourse);

export default r;
