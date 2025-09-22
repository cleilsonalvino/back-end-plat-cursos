import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/AppError.js';

export const getCertificates = async (userId: string) => {
  const certificates = await prisma.certificate.findMany({
    where: {
      userId,
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  return certificates;
};

export const getCertificate = async (userId: string, courseId: string) => {
  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!certificate) {
    throw new AppError('Certificate not found', 404);
  }

  return certificate;
};
