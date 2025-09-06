import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { login, register, refresh, loginSchema, registerSchema } from './auth.controller.js';

const r = Router();
r.post('/register', validate(registerSchema), register);
r.post('/login', validate(loginSchema), login);
r.post('/refresh', refresh);
export default r;
