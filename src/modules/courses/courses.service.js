import { prisma } from "../../db/prisma.js";

export class CoursesService {
  async list({ search, category, level, take = 20, skip = 0 }) {
    const where = {};
    if (search)
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    if (category) where.category = category;
    if (level) where.level = level;
    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: { instructor: { select: { id: true, name: true } } },
      }),
      prisma.course.count({ where }),
    ]);
    return { items, total, take, skip };
  }
  async bySlug(slug) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { position: "asc" },
          include: { lessons: { orderBy: { position: "asc" } } },
        },
        instructor: { select: { id: true, name: true } },
      },
    });
    if (!course)
      throw {
        status: 404,
        code: "COURSE_NOT_FOUND",
        message: "Curso não encontrado",
      };
    return course;
  }
  async create(data) {
    return prisma.course.create({
      data: { ...data, priceCents: data.priceCents ?? 0, visibility: "PUBLIC" },
    });
  }
}
