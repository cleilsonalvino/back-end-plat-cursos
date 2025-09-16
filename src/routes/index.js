import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import courseRoutes from '../modules/courses/courses.routes.js';

const r = Router();

r.get('/health', (_req, res) =>
  res.json({ ok: true, service: 'ajafs-cursos-api' })
);

// Rotas oficiais
r.use('/auth', authRoutes);
r.use('/cursos', courseRoutes);



export default r;
