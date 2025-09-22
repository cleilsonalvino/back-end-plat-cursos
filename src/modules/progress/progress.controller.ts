import { Request, Response } from 'express';
import * as progressService from './progress.service.js';
import { AppError } from '../../utils/AppError.js';

export const setLessonProgressHandler = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { lessonId, completed } = req.body;

  const progress = await progressService.setLessonProgress(
    userId,
    lessonId,
    completed
  );

  res.status(200).json(progress);
};

export const completeModuleHandler = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { moduleId } = req.body;

  const moduleProgress = await progressService.completeModule(userId, moduleId);

  res.status(200).json(moduleProgress);
};

export const getCourseProgressHandler = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { courseId } = req.params;

  const progress = await progressService.getCourseProgress(userId, courseId);

  res.status(200).json(progress);
};