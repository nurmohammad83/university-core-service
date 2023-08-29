import {
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDb = async (
  registrationData: SemesterRegistration
): Promise<SemesterRegistration | null> => {
  const isAnySemesterRegUpcomingAndOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegUpcomingAndOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `
    There is already an ${isAnySemesterRegUpcomingAndOngoing.status} registration`
    );
  }
  const result = await prisma.semesterRegistration.create({
    data: registrationData,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

export const SemesterRegistrationService = {
  insertIntoDb,
};
