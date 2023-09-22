/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicSemester, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import IAcademicSemesterFilter from './academicSemester.interface';
import {
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_DELETE,
  EVENT_ACADEMIC_SEMESTER_UPDATE,
  academicSemesterSearchableField,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constains';
import prisma from '../../../shared/prisma';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { RedisClint } from '../../../shared/redis';

const insetIntoDb = async (
  academicSemesterData: AcademicSemester
): Promise<AcademicSemester> => {
  if (
    academicSemesterTitleCodeMapper[academicSemesterData.title] !==
    academicSemesterData.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code!');
  }
  const result = await prisma.academicSemester.create({
    data: academicSemesterData,
  });

  if (result) {
    await RedisClint.publish(
      EVENT_ACADEMIC_SEMESTER_CREATED,
      JSON.stringify(result)
    );
  }
  return result;
};

const getAllToDb = async (
  filters: IAcademicSemesterFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  console.log(options);
  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: academicSemesterSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditons.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  /**
   * person = { name: 'fahim' }
   * name = person[name]
   *
   */

  const whereConditons: Prisma.AcademicSemesterWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.academicSemester.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleToDb = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: { id },
  });
  return result;
};

const updateAcademicSemester = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.update({
    where: { id },
    data: payload,
  });
  if (result) {
    await RedisClint.publish(
      EVENT_ACADEMIC_SEMESTER_UPDATE,
      JSON.stringify(result)
    );
  }
  return result;
};
const deleteAcademicSemester = async (
  id: string
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
    where: { id },
  });
  if (result) {
    await RedisClint.publish(
      EVENT_ACADEMIC_SEMESTER_DELETE,
      JSON.stringify(result)
    );
  }
  return result;
};

export const AcademicSemesterService = {
  insetIntoDb,
  getAllToDb,
  getSingleToDb,
  updateAcademicSemester,
  deleteAcademicSemester,
};
