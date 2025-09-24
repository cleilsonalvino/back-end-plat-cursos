import { prisma } from "../../db/prisma.js";
import { Prisma } from "@prisma/client";

export class InstructorService {
    async createCourse(data: Prisma.CourseCreateInput, instructorId: string) {
        const course = await prisma.course.create({
            data: {
                ...data,
                instructor: {
                    connect: {
                        id: instructorId,
                    },
                },
            },
        });
        return course;
    }

    async getCourses(instructorId: string) {
        const courses = await prisma.course.findMany({
            where: {
                instructorId,
            },
        });
        return courses;
    }

    async updateCourse(courseId: string, data: Prisma.CourseUpdateInput) {
        const course = await prisma.course.update({
            where: {
                id: courseId,
            },
            data,
        });
        return course;
    }

    async deleteCourse(courseId: string) {
        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });
    }

    async getCourse(courseId: string) {
        console.log('courseId', courseId);
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                instructor: true,
            },
        });
        return course;
    }
}
