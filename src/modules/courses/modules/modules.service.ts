import { prisma } from "../../../db/prisma.js";


export class ModulesService {
  async create(data: { title: string; courseId: string; position: number }) {
    return prisma.module.create({
      data,
    });
  }

  async listByCourse(courseId: string) {
    return prisma.module.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
      include: { lessons: {
        select: {
          id: true,
          title: true,
          durationS: true,
          position: true,
        }
      } }, // traz também as lições do módulo
    });
  }
}

