import { Router } from 'express';
import * as progressController from './progress.controller.js';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Rotas para gerenciar o progresso do aluno
 */

/**
 * @swagger
 * /progress:
 *   post:
 *     summary: Atualiza o progresso de um aluno em uma aula
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *               - completed
 *             properties:
 *               lessonId:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Progresso atualizado com sucesso
 *       "401":
 *         description: Não autorizado
 *       "403":
 *         description: Usuário não matriculado no curso
 *       "404":
 *         description: Lição não encontrada
 */
router.post(
  '/',
  auth,
  requireRole('STUDENT'),
  progressController.setLessonProgressHandler
);

/**
 * @swagger
 * /progress/module:
 *   post:
 *     summary: Marca um módulo como concluído
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *             properties:
 *               moduleId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Módulo marcado como concluído com sucesso
 *       "400":
 *         description: Nem todas as lições do módulo estão concluídas
 *       "401":
 *         description: Não autorizado
 *       "403":
 *         description: Usuário não matriculado no curso
 *       "404":
 *         description: Módulo não encontrado
 */
router.post(
  '/module',
  auth,
  requireRole('STUDENT'),
  progressController.completeModuleHandler
);

/**
 * @swagger
 * /progress/{courseId}:
 *   get:
 *     summary: Obtém o progresso de um aluno em um curso
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       "200":
 *         description: Progresso do curso obtido com sucesso
 *       "401":
 *         description: Não autorizado
 *       "403":
 *         description: Usuário não matriculado no curso
 *       "404":
 *         description: Curso não encontrado
 */
router.get(
  '/:courseId',
  auth,
  requireRole('STUDENT'),
  progressController.getCourseProgressHandler
);

export default router;
