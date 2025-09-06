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

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    res.json(await service.register(name, email, password));
  } catch (e) {
    next(e);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    res.json(await service.login(email, password));
    
  } catch (e) {
    next(e);
  }
};
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    res.json(await service.refresh(refreshToken));
  } catch (e) {
    next(e);
  }
};
