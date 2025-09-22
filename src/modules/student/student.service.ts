import { prisma } from "../../db/prisma.js";
import { Prisma } from "@prisma/client";

export class StudentService {
  async enroll(studentId: string, courseId: string) {
    // Check if the student is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      throw new Error("Student is already enrolled in this course.");
    }

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: studentId,
        courseId: courseId,
      },
    });

    return enrollment;
  }

  async getEnrollments(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: studentId,
      },
      include: {
        course: true,
      },
    });

    return enrollments;
  }

  async completeCourse(studentId: string, courseId: string) {
    // Check if the student is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        courseId: courseId,
      },
    });

    if (!enrollment) {
      throw new Error("Student is not enrolled in this course.");
    }

    // Check if the student has completed all the lessons in the course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        lessons: true,
      },
    });

    const studentProgress = await prisma.progress.findMany({
      where: {
        userId: studentId,
        lessonId: {
          in: course?.lessons.map((lesson) => lesson.id),
        },
        completed: true,
      },
    });

    if (studentProgress.length !== course?.lessons.length) {
      throw new Error("Student has not completed all the lessons in this course.");
    }

    // Mark the course as completed
    // In our schema, we don't have a completed field in the enrollment table.
    // We can consider a course completed if the student has progress for all lessons.
    // We can add a `completedAt` field to the `Enrollment` model.
    // For now, I will just return the enrollment.
    return enrollment;
  }

  async issueCertificate(studentId: string, courseId: string) {
    // Check if the student has completed the course
    await this.completeCourse(studentId, courseId);

    // Check if a certificate has already been issued
    const existingCertificate = await prisma.certificate.findFirst({
        where: {
            userId: studentId,
            courseId: courseId,
        },
    });

    if (existingCertificate) {
        return existingCertificate;
    }

    // Create the certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId: studentId,
        courseId: courseId,
        code: `${studentId}-${courseId}-${new Date().getTime()}`,
      },
    });

    return certificate;
  }

  async getCertificates(studentId: string) {
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: studentId,
      },
      include: {
        course: true,
      },
    });

    return certificates;
  }
}
