/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICourseData, ICourseFilter } from './course.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Course, Prisma } from '@prisma/client';
import { courseSearchableFields } from './course.constans';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';

const insertIntoDb = async (data: ICourseData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;
  const newCourse = await prisma.$transaction(async transactionClint => {
    const result = await transactionClint.course.create({
      data: courseData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create courses');
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      for (let i = 0; i < preRequisiteCourses.length; i++) {
        const createPreRequisite =
          await transactionClint.courseToPrerequisiteId.create({
            data: {
              courseId: result.id,
              preRequisiteId: preRequisiteCourses[i].courseId,
            },
          });
        console.log(createPreRequisite);
      }
    }

    return result;
  });
  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: { id: newCourse.id },
      include: {
        prerequsite: {
          include: {
            preRequisite: true,
          },
        },
        prerequsiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create courses');
};

const getAllCourses = async (
  filter: ICourseFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[] | null>> => {
  const { searchTerm, ...filterData } = filter;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const total = await prisma.course.count({ where: whereConditions });
  const result = await prisma.course.findMany({
    where: whereConditions,
    include: {
      prerequsite: {
        include: {
          preRequisite: true,
        },
      },
      prerequsiteFor: {
        include: {
          course: true,
        },
      },
    },
    skip,
    take: limit,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const CourseService = { insertIntoDb, getAllCourses };
