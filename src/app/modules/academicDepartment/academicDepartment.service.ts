/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicDepartment, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import IAcademicDepartmentsFilter from './academicDepartment.interface';
import { IGenericResponse } from '../../../interfaces/common';
import {
  EVENT_ACADEMIC_DEPARTMENT_CREATED,
  EVENT_ACADEMIC_DEPARTMENT_DELETE,
  EVENT_ACADEMIC_DEPARTMENT_UPDATE,
  academicDepartmentSearchableField,
} from './academicDepartment.constans';
import { RedisClint } from '../../../shared/redis';

const insertIntoDb = async (
  academicDepartmentData: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data: academicDepartmentData,
  });

  if (result) {
    await RedisClint.publish(
      EVENT_ACADEMIC_DEPARTMENT_CREATED,
      JSON.stringify(result)
    );
  }
  return result;
};

const getAllDepartments = async (
  filters: IAcademicDepartmentsFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (searchTerm) {
    andConditions.push({
      OR: academicDepartmentSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicDepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const total = await prisma.academicDepartment.count({
    where: whereConditions,
  });
  const result = await prisma.academicDepartment.findMany({
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

const updateAcademicDepartment = async (
  id: string,
  payload: Partial<AcademicDepartment>
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.update({
    where: { id },
    data: payload,
  });
  if (result) {
    await RedisClint.publish(
      EVENT_ACADEMIC_DEPARTMENT_UPDATE,
      JSON.stringify(result)
    );
  }
  return result;
};

const getSingleToDb = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: { id },
  });
  return result;
};

const deleteAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.delete({
    where: { id },
  });
  if (result) {
    await RedisClint.publish(
      EVENT_ACADEMIC_DEPARTMENT_DELETE,
      JSON.stringify(result)
    );
  }
  return result;
};

export const AcademicDepartmentService = {
  insertIntoDb,
  getAllDepartments,
  updateAcademicDepartment,
  deleteAcademicDepartment,
  getSingleToDb,
};
