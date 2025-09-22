import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';
import {
  getCertificateHandler,
  getCertificatesHandler,
} from './certificate.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Rotas para gerenciar certificados
 */

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Obtém todos os certificados de um usuário
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Certificados obtidos com sucesso
 *       "401":
 *         description: Não autorizado
 */
router.get('/', auth, requireRole('STUDENT'), getCertificatesHandler);

/**
 * @swagger
 * /certificates/{courseId}:
 *   get:
 *     summary: Obtém o certificado de um curso
 *     tags: [Certificates]
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
 *         description: Certificado obtido com sucesso
 *       "401":
 *         description: Não autorizado
 *       "404":
 *         description: Certificado não encontrado
 */
router.get('/:courseId', auth, requireRole('STUDENT'), getCertificateHandler);

export default router;
