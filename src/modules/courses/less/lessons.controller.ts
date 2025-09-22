import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { LessonsService } from './lessons.service.js';

const service = new LessonsService();

// Validação do body
export const lessonSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    videoUrl: z.string().url(),
    durationS: z.number().int().min(1),
    position: z.number().int().min(1),
    courseId: z.string().cuid(),
    moduleId: z.string().cuid(),
  }),
});

// Criar lição
export const createLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lesson = await service.create(req.body);
    res.status(201).json(lesson);
  } catch (e) {
    next(e);
  }
};

// Listar lições de um módulo
export const listLessonsByModule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { moduleId } = req.body; // vem do body também
    const lessons = await service.listByModule(moduleId);
    res.json(lessons);
  } catch (e) {
    next(e);
  }
};

