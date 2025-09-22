import { Request, Response } from 'express';
import * as enrollmentService from './enrollment.service.js';
import { AppError } from '../../utils/AppError.js';

export const createEnrollmentHandler = async (req: Request, res: Response) => {
  const { courseId, userEmail } = req.body;

  console.log('courseId:', courseId);
  console.log('userEmail:', userEmail);

  const enrollment = await enrollmentService.createEnrollment(userEmail, courseId);
  res.status(201).json(enrollment);
};

export const getEnrollmentsHandler = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const enrollments = await enrollmentService.getEnrollmentsByUserId(userId);
    res.status(200).json(enrollments);
};

export const getEnrollmentHandler = async (req: Request, res: Response) => {
    const enrollmentId = req.params.enrollmentId;
    const enrollment = await enrollmentService.getEnrollmentById(enrollmentId);
    res.status(200).json(enrollment);
};

export const deleteEnrollmentHandler = async (req: Request, res: Response) => {
    const enrollmentId = req.params.enrollmentId;
    await enrollmentService.deleteEnrollment(enrollmentId);
    res.status(204).send();
};
