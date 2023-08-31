import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (classScheduleData: OfferedCourseClassSchedule) => {
  const result = await prisma.offeredCourseClassSchedule.create({
    data: classScheduleData,
    include: {
      semesterRegistration: true,
      offeredCoursesSection: true,
      room: true,
      faculty: true,
    },
  });
  return result;
};

export const OfferedCourseClassScheduleService = {
  insertIntoDb,
};
