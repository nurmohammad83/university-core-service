import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICourseData } from './course.interface';

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

export const CourseService = { insertIntoDb };
