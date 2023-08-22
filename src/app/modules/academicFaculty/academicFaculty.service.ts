/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicFaculty, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { academicFacultySearchableField } from './academicFaculty.constants';
import IAcademicFacultyFilter from './academicFaculty.interface';

const insetIntoDb = async (
  academicFacultyData: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.create({
    data: academicFacultyData,
  });
  return result;
};

const getAllFaculty = async (
  filters: IAcademicFacultyFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
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
      OR: academicFacultySearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const total = await prisma.academicFaculty.count();
  const result = await prisma.academicFaculty.findMany({
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

const getSingleFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: { id },
  });
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.update({
    where: { id },
    data: payload,
  });
  return result;
};
const deleteAcademicFaculty = async (id: string): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.delete({
    where: { id },
  });
  return result;
};

export const AcademicFacultyService = {
  insetIntoDb,
  getAllFaculty,
  getSingleFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
