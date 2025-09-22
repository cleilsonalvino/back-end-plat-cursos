import { prisma } from "../../db/prisma.js";
import { Prisma } from "@prisma/client";

interface ListCoursesParams {
  search?: string;
  category?: string;
  level?: string;
  take?: number;
  skip?: number;
}

export class CoursesService {
  async list({
    search,
    category,
    level,
    take = 20,
    skip = 0,
  }: ListCoursesParams) {
    const where: Prisma.CourseWhereInput = {};
    if (search)
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    if (category) where.category = category;
    if (level) where.level = level;

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          instructor: { select: { id: true, name: true } },
          lessons: { select: { durationS: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    // adiciona a soma das lições em cada curso
    const itemsWithDuration = items.map((course) => ({
      ...course,
      durationS: course.lessons.reduce(
        (acc, lesson) => acc + lesson.durationS,
        0
      ),
    }));

    return { items: itemsWithDuration, total, take, skip };
  }

  async bySlug(slug: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              select: { id: true, title: true, durationS: true },
            },
          },
        },
        lessons: { select: { durationS: true } }, // 👈 pega também direto do curso
        instructor: { select: { id: true, name: true } },
      },
    });

    if (!course)
      throw {
        status: 404,
        code: "COURSE_NOT_FOUND",
        message: "Curso não encontrado",
      };

    // calcula a soma geral
    const durationS = course.lessons.reduce(
      (acc, lesson) => acc + lesson.durationS,
      0
    );

    return { ...course, durationS };
  }

  async create(data: Prisma.CourseCreateInput) {
    return prisma.course.create({
      data: { ...data, priceCents: data.priceCents ?? 0, visibility: "PUBLIC" },
    });
  }
}
