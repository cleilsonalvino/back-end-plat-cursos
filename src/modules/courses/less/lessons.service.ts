import { prisma } from "../../../db/prisma.js";

interface CreateLessonDTO {
  title: string;
  videoUrl: string;
  durationS: number;
  position: number;
  courseId: string;
  moduleId: string;
}

export class LessonsService {
  // Criar lição
  async create(data: CreateLessonDTO) {
    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        durationS: data.durationS,
        position: data.position,
        courseId: data.courseId,
        moduleId: data.moduleId,
      },
    });
    return lesson;
  }

  // Listar lições por módulo
  async listByModule(moduleId: string) {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { position: 'asc' },
    });
    return lessons;
  }

  async listPublicByModule(moduleId: string) {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { position: 'asc' },
      select:{
        title: true,
        durationS: true,
        position: true,
      }
    });
    return lessons;
  }
}
