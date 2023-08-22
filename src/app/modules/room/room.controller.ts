import { Rooms } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { RoomService } from './room.service';
import { roomFilterableFields } from './room.constains';
const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room created successfully',
    data: result,
  });
});
const getAllToDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, roomFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await RoomService.getAllRoom(filters, options);
  sendResponse<Rooms[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.getSingleToDb(req.params.id);
  sendResponse<Rooms>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room retrieved Successfully',
    data: result,
  });
});

const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await RoomService.updateRoom(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'updateRoom update successfully',
    data: result,
  });
});

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RoomService.deleteRoom(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleteRoom delete successfully',
    data: result,
  });
});

export const RoomController = {
  insertIntoDb,
  getAllToDb,
  getSingleToDb,
  updateRoom,
  deleteRoom,
};
