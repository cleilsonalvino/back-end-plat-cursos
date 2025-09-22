import { Request, Response, NextFunction } from 'express';
import { z } from "zod";
import { AuthService } from "./auth.service.js";

const service = new AuthService();

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    res.json(await service.register(name, email, password));
  } catch (e) {
    next(e);
  }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    return res.status(200).json(result);
  } catch (e: any) {
    console.error(e);

    // Se o erro já vem com status e código
    if (e.status) {
      return res.status(e.status).json({
        status: e.status,
        code: e.code || 'ERROR',
        message: e.message || 'Erro desconhecido',
        details: e.details || [],
      });
    }

    // Caso contrário, erro genérico
    return res.status(500).json({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno no servidor',
    });
  }
};


export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    res.json(await service.refresh(refreshToken));
  } catch (e) {
    
    next(e);
  }
};