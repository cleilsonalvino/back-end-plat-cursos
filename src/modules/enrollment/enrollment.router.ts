import { Router } from 'express';
import * as enrollmentController from './enrollment.controller.js';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: Rotas para gerenciar matrículas
 */

/**
 * @swagger
 * /matricula:
 *   post:
 *     summary: Cria uma nova matrícula
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Matrícula criada com sucesso
 *       "401":
 *         description: Não autorizado
 *       "404":
 *         description: Usuário ou curso não encontrado
 *       "409":
 *         description: Usuário já matriculado no curso
 */
router.post(
  '/',
  auth,
  requireRole('ADMIN', 'INSTRUCTOR'),
  enrollmentController.createEnrollmentHandler
);

/**
 * @swagger
 * /matricula/user/{userId}:
 *   get:
 *     summary: Busca todas as matrículas de um usuário
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Lista de matrículas
 *       "401":
 *         description: Não autorizado
 */
router.get(
  '/user/:userId',
  auth,
  requireRole('STUDENT', 'ADMIN'),
  enrollmentController.getEnrollmentsHandler
);

/**
 * @swagger
 * /matricula/{enrollmentId}:
 *   get:
 *     summary: Busca uma matrícula pelo ID
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Detalhes da matrícula
 *       "401":
 *         description: Não autorizado
 *       "404":
 *         description: Matrícula não encontrada
 */
router.get(
  '/:enrollmentId',
  auth,
  requireRole('STUDENT', 'ADMIN'),
  enrollmentController.getEnrollmentHandler
);

/**
 * @swagger
 * /matricula/{enrollmentId}:
 *   delete:
 *     summary: Deleta uma matrícula
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: Matrícula deletada com sucesso
 *       "401":
 *         description: Não autorizado
 *       "403":
 *         description: Permissão insuficiente
 *       "404":
 *         description: Matrícula não encontrada
 */
router.delete(
  '/:enrollmentId',
  auth,
  requireRole('ADMIN'),
  enrollmentController.deleteEnrollmentHandler
);


export default router;
