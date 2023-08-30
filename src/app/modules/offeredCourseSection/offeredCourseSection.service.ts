import { OfferedCourseSection } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDb = async (data: any): Promise<OfferedCourseSection> => {
  const isExist = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  data.semesterRegistrationId = isExist?.semesterRegistrationId;
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data dose not exist');
  }
  const result = await prisma.offeredCourseSection.create({ data });
  return result;
};

export const OfferedCourseSectionService = { insertIntoDb };
