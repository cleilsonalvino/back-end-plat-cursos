import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';
import { list, bySlug, create, qSchema, createSchema } from './courses.controller.js';

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Rotas de cursos
 */

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca para filtrar cursos
 *     responses:
 *       "200":
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   description:
 *                     type: string
 */
r.get('/', validate(qSchema), list);

/**
 * @swagger
 * /cursos/{slug}:
 *   get:
 *     summary: Obtém um curso pelo slug
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug do curso
 *     responses:
 *       "200":
 *         description: Detalhes do curso
 *       "404":
 *         description: Curso não encontrado
 */
r.get('/:slug', bySlug);


/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Curso criado com sucesso
 *       "400":
 *         description: Erro de validação
 *       "401":
 *         description: Não autorizado
 *       "403":
 *         description: Proibido
 */
r.post('/create', auth, requireRole('INSTRUCTOR', 'ADMIN'), validate(createSchema), create);

export default r;
