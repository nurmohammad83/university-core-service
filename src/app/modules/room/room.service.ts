/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Rooms } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import IRoomFilter from './room.interface';
import { roomSearchableField } from './room.constains';

const insertIntoDb = async (roomData: Rooms): Promise<Rooms> => {
  const result = await prisma.rooms.create({
    data: roomData,
    include: {
      building: true,
    },
  });
  return result;
};

const getAllRoom = async (
  filters: IRoomFilter,
  options: IPaginationOptions
) => {
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
      OR: roomSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.RoomsWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.rooms.findMany({
    where: whereConditions,
    include: {
      building: true,
    },
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
  const total = await prisma.rooms.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleToDb = async (id: string): Promise<Rooms | null> => {
  const result = await prisma.rooms.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

const updateRoom = async (
  id: string,
  payload: Partial<Rooms>
): Promise<Rooms> => {
  const result = await prisma.rooms.update({
    where: { id },
    include: {
      building: true,
    },
    data: payload,
  });
  return result;
};
const deleteRoom = async (id: string): Promise<Rooms> => {
  const result = await prisma.rooms.delete({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

export const RoomService = {
  insertIntoDb,
  getAllRoom,
  updateRoom,
  getSingleToDb,
  deleteRoom,
};
