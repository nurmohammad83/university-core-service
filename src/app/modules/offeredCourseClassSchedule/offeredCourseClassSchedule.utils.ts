import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { hasTimeConflict } from '../../../shared/utils';

const checkRoomIsAvailable = async (
  classScheduleData: OfferedCourseClassSchedule
) => {
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
};
const checkFacultyAvailable = async (
  classScheduleData: OfferedCourseClassSchedule
) => {
  const alreadyFacultyExist = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: classScheduleData.dayOfWeek,
      faculty: {
        id: classScheduleData.facultyId,
      },
    },
  });

  const existingSlots = alreadyFacultyExist.map(schedule => ({
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
    throw new ApiError(httpStatus.BAD_REQUEST, 'Faculty is already booked!');
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomIsAvailable,
  checkFacultyAvailable,
};
