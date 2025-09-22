import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import courseRoutes from '../modules/courses/courses.routes.js';
import studentRoutes from '../modules/student/student.routes.js';
import moduleRoutes from '../modules/courses/modules/modules.routes.js'; // import do módulo
import less from '../modules/courses/less/lessons.routes.js';
import enrollmentRoutes from '../modules/enrollment/enrollment.router.js';
import progressRoutes from '../modules/progress/progress.routes.js';
import certificateRoutes from '../modules/certificate/certificate.routes.js';


const r = Router();

r.get('/health', (_req, res) =>
  res.json({ ok: true, service: 'ajafs-cursos-api' })
);

// Rotas oficiais
r.use('/auth', authRoutes);

r.use('/cursos', courseRoutes);

r.use('/matricula', enrollmentRoutes);

r.use('/progress', progressRoutes);

r.use('/certificates', certificateRoutes);

// Aqui montamos os módulos de cursos
r.use('/cursos/modulos', moduleRoutes);

// Rota de lição

r.use('/cursos/modulos/licao', less)

r.use('/student', studentRoutes);

export default r;
