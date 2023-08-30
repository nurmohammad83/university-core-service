/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourse } from '@prisma/client';
import { IOfferedCourseCreate } from './offeredCourse.interface';
import { asyncForEach } from '../../../shared/utils';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (
  data: IOfferedCourseCreate
): Promise<OfferedCourse[]> => {
  const { courseIds, semesterRegistrationId, academicDepartmentId } = data;
  const result: any[] = [];
  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });

    if (!alreadyExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          academicDepartment: true,
          semesterRegistration: true,
          course: true,
        },
      });
      result.push(insertOfferedCourse);
    }
  });
  return result;
};

export const OfferedCourseService = {
  insertIntoDb,
};
