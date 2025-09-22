import { Request, Response, NextFunction } from 'express';
import { StudentService } from './student.service.js';

const studentService = new StudentService();

export const enroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user!.sub;
        const enrollment = await studentService.enroll(studentId, courseId);
        res.status(201).json(enrollment);
    } catch (error) {
        next(error);
    }
};

export const getEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.user!.sub;
        const enrollments = await studentService.getEnrollments(studentId);
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

export const completeCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user!.sub;
        const enrollment = await studentService.completeCourse(studentId, courseId);
        res.json(enrollment);
    } catch (error) {
        next(error);
    }
};

export const issueCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user!.sub;
        const certificate = await studentService.issueCertificate(studentId, courseId);
        res.json(certificate);
    } catch (error) {
        next(error);
    }
};

export const getCertificates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.user!.sub;
        const certificates = await studentService.getCertificates(studentId);
        res.json(certificates);
    } catch (error) {
        next(error);
    }
};