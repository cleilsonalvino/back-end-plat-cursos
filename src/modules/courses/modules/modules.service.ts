import { prisma } from "../../../db/prisma.js";


export class ModulesService {
  async create(data: { title: string; courseId: string; position: number }) {
    return prisma.module.create({
      data,
    });
  }

 async listByCourseWithProgress(courseId: string, userId: string) {
  const [modules, progresses] = await prisma.$transaction([
    prisma.module.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        position: true,
        lessons: {
          select: { id: true, title: true, durationS: true, position: true },
          orderBy: { position: 'asc' },
        },
      },
    }),

    prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        lesson: { courseId },
      },
      select: { lessonId: true },
    }),
  ]);

  const doneSet = new Set(progresses.map(p => p.lessonId));

  const modulesOut = modules.map(m => {
    const lessons = m.lessons.map(l => ({
      ...l,
      durationS: l.durationS ?? 0,
      completed: doneSet.has(l.id),
    }));
    const total = lessons.length;
    const done = lessons.filter(l => l.completed).length;

    return {
      id: m.id,
      title: m.title,
      position: m.position,
      lessons,
      summary: {
        done,
        total,
        completed: total > 0 && done === total,
      },
    };
  });

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = doneSet.size;

  return {
    modules: modulesOut,
    progress: {
      completedLessonIds: Array.from(doneSet),
      totalLessons,
      completedLessons,
      completed: totalLessons > 0 && completedLessons === totalLessons,
    },
  };
}
}

