import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';
import { enroll, getEnrollments, completeCourse, issueCertificate, getCertificates, getStudentCoursesWithProgress, getCourseModules } from './student.controller.js';

const router = Router();

router.use(auth, requireRole('STUDENT'));

router.post('/courses/:courseId', enroll);
router.get('/courses', getEnrollments);
router.get('/course/modules/:slug', getCourseModules)
router.get('/courses/progress', getStudentCoursesWithProgress);
router.post('/courses/:courseId/complete', completeCourse);
router.post('/courses/:courseId/certificate', issueCertificate);
router.get('/certificates', getCertificates);

export default router;
