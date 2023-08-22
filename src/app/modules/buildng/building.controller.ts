import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BuildingService } from './building.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Building } from '@prisma/client';
import { buildingFilterableFields } from './building.constains';
import pick from '../../../shared/pick';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building created successfully',
    data: result,
  });
});
const getAllToDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await BuildingService.getAllBuildings(filters, options);
  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.getSingleToDb(req.params.id);
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester retrieved Successfully',
    data: result,
  });
});

const updateBuilding = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await BuildingService.updateBuilding(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'updateBuilding update successfully',
    data: result,
  });
});

const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BuildingService.deleteBuilding(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleteBuilding delete successfully',
    data: result,
  });
});

export const BuildingController = {
  insertIntoDb,
  getAllToDb,
  getSingleToDb,
  updateBuilding,
  deleteBuilding,
};
