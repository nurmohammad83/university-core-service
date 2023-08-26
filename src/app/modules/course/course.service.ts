/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import {
  ICourseData,
  ICourseFilter,
  IPrerequisiteRequest,
} from './course.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Course, Prisma } from '@prisma/client';
import { courseSearchableFields } from './course.constans';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { asyncForEach } from '../../../shared/utils';

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
      await asyncForEach(
        preRequisiteCourses,
        async (createPrerequisiteCourse: IPrerequisiteRequest) => {
          const createPreRequisite =
            await transactionClint.courseToPrerequisiteId.create({
              data: {
                courseId: result.id,
                preRequisiteId: createPrerequisiteCourse.courseId,
              },
            });
          console.log(createPreRequisite);
        }
      );
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
const getSingleCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({ where: { id } });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Course> => {
  await prisma.courseToPrerequisiteId.deleteMany({
    where: {
      OR: [
        {
          courseId: id,
        },
        {
          preRequisiteId: id,
        },
      ],
    },
  });

  const result = await prisma.course.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateByIdFromDB = async (
  id: string,
  payload: ICourseData
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;
  await prisma.$transaction(async transactionClint => {
    const result = await transactionClint.course.update({
      where: { id },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePreRequisiteCourse = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && coursePrerequisite.isDelete
      );
      const newPreRequisiteCourse = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && !coursePrerequisite.isDelete
      );
      await asyncForEach(
        deletePreRequisiteCourse,
        async (deletePrerequisite: IPrerequisiteRequest) => {
          await transactionClint.courseToPrerequisiteId.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePrerequisite.courseId,
                },
              ],
            },
          });
        }
      );
      await asyncForEach(
        newPreRequisiteCourse,
        async (newPrerequisite: IPrerequisiteRequest) => {
          await transactionClint.courseToPrerequisiteId.create({
            data: {
              courseId: id,
              preRequisiteId: newPrerequisite.courseId,
            },
          });
        }
      );
    }
    return result;
  });

  const responseData = await prisma.course.findUnique({
    where: { id },
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
};

export const CourseService = {
  insertIntoDb,
  getAllCourses,
  getSingleCourse,
  deleteByIdFromDB,
  updateByIdFromDB,
};
