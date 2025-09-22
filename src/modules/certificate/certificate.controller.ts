import { Request, Response } from 'express';
import * as certificateService from './certificate.service.js';
import { AppError } from '../../utils/AppError.js';

export const getCertificatesHandler = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const certificates = await certificateService.getCertificates(userId);

  res.status(200).json(certificates);
};

export const getCertificateHandler = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { courseId } = req.params;

  const certificate = await certificateService.getCertificate(
    userId,
    courseId
  );

  res.status(200).json(certificate);
};
