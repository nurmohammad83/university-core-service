/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import IBuildingFilter from './buinding.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { buildingSearchableField } from './building.constains';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';

const insertIntoDb = async (buildingData: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: buildingData,
  });
  return result;
};

const getAllBuildings = async (
  filters: IBuildingFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
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
      OR: buildingSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.building.findMany({
    where: whereConditions,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    skip,
    take: limit,
  });
  const total = await prisma.building.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleToDb = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: { id },
  });
  return result;
};

const updateBuilding = async (
  id: string,
  payload: Partial<Building>
): Promise<Building> => {
  const result = await prisma.building.update({
    where: { id },
    data: payload,
  });
  return result;
};
const deleteBuilding = async (id: string): Promise<Building> => {
  const result = await prisma.building.delete({
    where: { id },
  });
  return result;
};

export const BuildingService = {
  insertIntoDb,
  getAllBuildings,
  updateBuilding,
  getSingleToDb,
  deleteBuilding,
};
