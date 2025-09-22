import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { login, register, refresh, loginSchema, registerSchema } from './auth.controller.js';

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       "201":
 *         description: Usuário registrado com sucesso
 *       "400":
 *         description: Erro de validação
 */
r.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       "200":
 *         description: Login bem-sucedido
 *       "401":
 *         description: Não autorizado
 */
r.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Atualiza o token de acesso
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: Token atualizado com sucesso
 *       "401":
 *         description: Não autorizado
 */
r.post('/refresh', refresh);

export default r;
