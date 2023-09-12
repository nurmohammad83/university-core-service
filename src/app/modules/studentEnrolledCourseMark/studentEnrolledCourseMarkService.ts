/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import prisma from '../../../shared/prisma';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IStudentEnrolledCourseMarkFilterRequest } from './studentEnrolledCourseMark.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';

const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const isExitMidtermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });
  if (!isExitMidtermData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isExistFinalData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExistFinalData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.FINAL,
      },
    });
  }
};

const getAllFromDB = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: filters.studentId,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
      student: true,
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

const updateStudentMarks = async (payload: any) => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const studentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          id: courseId,
        },
        examType,
      },
    });

  if (!studentEnrolledCourseMark) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student Enrolled Course Marks Not found'
    );
  }
  const getGradeMarks = StudentEnrolledCourseMarkUtils.getGradeMarks(marks);
  const updateStudentMark = await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMark.id,
    },
    data: { marks, grade: getGradeMarks.garde },
  });

  return updateStudentMark;
};

const updateFinalMark = async (payload: any) => {
  const { studentId, academicSemesterId, courseId } = payload;

  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
  });
  if (!studentEnrolledCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student Enrolled Course data Not found'
    );
  }

  const studentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });
  if (!studentEnrolledCourseMark.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student Enrolled Course Marks Data Not found'
    );
  }

  const midTermMark =
    (await studentEnrolledCourseMark.find(
      item => item.examType === ExamType.MIDTERM
    )?.marks) || 0;
  const finalMark =
    (await studentEnrolledCourseMark.find(
      item => item.examType === ExamType.FINAL
    )?.marks) || 0;

  const totalMark = Math.ceil(midTermMark * 0.4) + Math.ceil(finalMark * 0.6);

  const result = StudentEnrolledCourseMarkUtils.getGradeMarks(totalMark);
  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data: {
      grade: result.garde,
      point: result.point,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });
  const grades = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        id: studentId,
      },
    },
    include: {
      course: true,
    },
  });

  const academicResult =
    StudentEnrolledCourseMarkUtils.calcCGPAandGrade(grades);
  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        id: studentId,
      },
    },
  });

  if (studentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id,
      },
      data: {
        totalCompletedCredit: academicResult.totalCompletedCredit,
        cgpa: academicResult.cgpa,
      },
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        totalCompletedCredit: academicResult.totalCompletedCredit,
        cgpa: academicResult.cgpa,
      },
    });
  }

  return grades;
};
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  updateStudentMarks,
  getAllFromDB,
  updateFinalMark,
};
