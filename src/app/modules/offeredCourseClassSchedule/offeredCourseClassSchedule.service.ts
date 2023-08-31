import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { hasTimeConflict } from '../../../shared/utils';

const insertIntoDb = async (classScheduleData: OfferedCourseClassSchedule) => {
  const alreadyRoomScheduleIsExist =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: classScheduleData.dayOfWeek,
        room: {
          id: classScheduleData.roomId,
        },
      },
    });

  const existingSlots = alreadyRoomScheduleIsExist.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlot = {
    startTime: classScheduleData.startTime,
    endTime: classScheduleData.endTime,
    dayOfWeek: classScheduleData.dayOfWeek,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Room is already booked!');
  }

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
