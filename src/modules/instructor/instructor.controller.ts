import { Request, Response, NextFunction } from 'express';
import { InstructorService } from './instructor.service.js';

const instructorService = new InstructorService();

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instructorId = req.user!.sub;
        const course = await instructorService.createCourse(req.body, instructorId);
        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instructorId = req.user!.sub;
        const courses = await instructorService.getCourses(instructorId);
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const course = await instructorService.updateCourse(courseId, req.body);
        res.json(course);
    } catch (error) {
        next(error);
    }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        await instructorService.deleteCourse(courseId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const { courseId } = req.params;
        console.log('courseId', courseId);
        const course = await instructorService.getCourse(courseId);
        res.json(course);
    } catch (error) {
        next(error);
    }
};


