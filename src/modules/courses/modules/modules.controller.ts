import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ModulesService } from './modules.service.js';

const service = new ModulesService();

// Schema de validação para criar módulo
export const moduleSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    courseId: z.string().cuid(),
    position: z.number().int().min(1),
  }),
});

// Criar módulo
export const createModule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const module = await service.create(req.body);
    res.status(201).json(module);
  } catch (e) {
    next(e);
  }
};

// Listar módulos de um curso
export const listModulesByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.sub;
    const modules = await service.listByCourseWithProgress(courseId, userId);
    res.json(modules);
  } catch (e) {
    next(e);
  }
};

