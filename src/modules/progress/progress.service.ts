import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/AppError.js';

const checkAndMarkCourseCompletion = async (userId: string, courseId: string) => {
  const courseModules = await prisma.module.findMany({
    where: { courseId },
    select: { id: true },
  });

  const allModuleIdsInCourse = courseModules.map((m) => m.id);

  const completedModuleProgresses = await prisma.moduleProgress.findMany({
    where: {
      userId,
      moduleId: {
        in: allModuleIdsInCourse,
      },
      completed: true,
    },
    select: { moduleId: true },
  });

  const completedModuleIds = completedModuleProgresses.map((p) => p.moduleId);

  const allModulesCompleted = allModuleIdsInCourse.every((id) =>
    completedModuleIds.includes(id)
  );

  if (allModulesCompleted) {
    const code = `${userId.substring(0, 4)}-${courseId.substring(0, 4)}-${Date.now()
      .toString()
      .substring(8)}`;
    await prisma.$transaction([
      prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completed: true,
        },
      }),
      prisma.certificate.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {},
        create: {
          userId,
          courseId,
          code,
        },
      }),
    ]);
  }
};

export const completeModule = async (userId: string, moduleId: string) => {
  const moduleWithLessons = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { select: { id: true } } },
  });

  if (!moduleWithLessons) {
    throw new AppError('Module not found', 404);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: moduleWithLessons.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError('User is not enrolled in this course', 403);
  }

  const lessonIds = moduleWithLessons.lessons.map((l) => l.id);

  const completedLessons = await prisma.progress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds },
      completed: true,
    },
  });

  if (completedLessons.length !== lessonIds.length) {
    throw new AppError('Not all lessons in the module are completed', 400);
  }

  const moduleProgress = await prisma.moduleProgress.upsert({
    where: {
      userId_moduleId: { userId, moduleId },
    },
    update: { completed: true },
    create: { userId, moduleId, completed: true },
  });

  await checkAndMarkCourseCompletion(userId, moduleWithLessons.courseId);

  return moduleProgress;
};

export const setLessonProgress = async (
  userId: string,
  lessonId: string,
  completed: boolean
) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError('User is not enrolled in this course', 403);
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      completed,
    },
    create: {
      userId,
      lessonId,
      completed,
    },
  });

  if (completed && lesson.moduleId) {
    // Try to complete the module, but don't throw an error if it fails
    // because not all lessons might be completed yet.
    completeModule(userId, lesson.moduleId).catch((error) => {
      // You might want to log this error for debugging purposes
      console.error(`Failed to check module completion for module ${lesson.moduleId}:`, error.message);
    });
  }

  return progress;
};

export const getCourseProgress = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError('User is not enrolled in this course', 403);
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        select: { id: true },
      },
      lessons: {
        select: { id: true },
      },
    },
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const totalLessons = course.lessons.length;
  const totalModules = course.modules.length;

  const completedLessons = await prisma.progress.count({
    where: {
      userId,
      lessonId: {
        in: course.lessons.map((l) => l.id),
      },
      completed: true,
    },
  });

  const completedModules = await prisma.moduleProgress.count({
    where: {
      userId,
      moduleId: {
        in: course.modules.map((m) => m.id),
      },
      completed: true,
    },
  });

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const remainingLessons = totalLessons - completedLessons;
  const remainingModules = totalModules - completedModules;

  return {
    progressPercentage,
    remainingLessons,
    remainingModules,
    completedLessons,
    totalLessons,
    completedModules,
    totalModules,
  };
};