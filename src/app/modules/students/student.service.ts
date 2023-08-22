/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Student } from '@prisma/client';
import prisma from '../../../shared/prisma';
import IStudentFilter from './student.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  studentRelationalFields,
  studentRelationalFieldsMapper,
  studentSearchableField,
} from './student.constans';

const createStudent = async (studentData: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: studentData,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};
const getAllStudents = async (
  filters: IStudentFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (studentRelationalFields.includes(key)) {
          return {
            [studentRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const total = await prisma.student.count();
  const result = await prisma.student.findMany({
    where: whereConditions,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
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
const getSingleStudent = async (id: string) => {
  const result = await prisma.student.findUnique({
    where: { id },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student> => {
  const result = await prisma.student.update({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
    data: payload,
  });
  return result;
};
const deleteStudent = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });
  return result;
};
export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
