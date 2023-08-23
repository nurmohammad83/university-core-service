import { Course } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (data: Course): Promise<Course> => {
  const result = await prisma.course.create({
    data,
  });
  return result;
};

export const CourseService = { insertIntoDb };
