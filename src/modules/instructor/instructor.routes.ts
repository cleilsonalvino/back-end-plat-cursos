import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';
import { createCourse, getCourses, updateCourse, deleteCourse, getCourse } from './instructor.controller.js';

const router = Router();

router.use(auth, requireRole('INSTRUCTOR'));

router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourse);
router.put('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

export default router;
