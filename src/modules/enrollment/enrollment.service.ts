import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const createEnrollment = async (userEmail: string, courseId: string) => {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  console.log(courseId)

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });

  if (existingEnrollment) {
    throw new AppError('User is already enrolled in this course', 409);
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId,
    },
  });

  return enrollment;
};

export const getEnrollmentsByUserId = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
  });
  return enrollments;
};

export const getEnrollmentById = async (enrollmentId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, user: true },
  });

  if (!enrollment) {
    throw new AppError('Enrollment not found', 404);
  }

  return enrollment;
};

export const deleteEnrollment = async (enrollmentId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollment) {
    throw new AppError('Enrollment not found', 404);
  }

  await prisma.enrollment.delete({ where: { id: enrollmentId } });
};
