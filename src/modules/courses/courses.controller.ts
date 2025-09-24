import { Request, Response, NextFunction } from 'express';
import { z } from "zod";
import { CoursesService } from "./courses.service.js";

const service = new CoursesService();

export const qSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    level: z.string().optional(),
    take: z.coerce.number().int().min(1).max(100).optional(),
    skip: z.coerce.number().int().min(0).optional(),
  }),
});

export const createSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(2),
    level: z.string().min(2),
    priceCents: z.number().int().min(0).optional(),
    instructorId: z.string().cuid(),
  }),
});

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, level, take, skip } = req.query;
    res.json(await service.list({
      search: search as string | undefined,
      category: category as string | undefined,
      level: level as string | undefined,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    }));
  } catch (e) {
    next(e);
  }
};

export const bySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await service.bySlug(req.params.slug));
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (e) {
    next(e);
  }
};

