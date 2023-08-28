import { SemesterRegistration } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (registrationData: SemesterRegistration) => {
  const result = await prisma.semesterRegistration.create({
    data: registrationData,
  });
  return result;
};

export const SemesterRegistrationService = {
  insertIntoDb,
};
