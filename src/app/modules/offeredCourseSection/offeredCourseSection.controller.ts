import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionService } from './offeredCourseSection.service';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import pick from '../../../shared/pick';
import { offeredCourseSectionFilterableFields } from './offeredCourseSection.constans';
import { paginationFields } from '../../../constants/pagination';
import { OfferedCourseSection } from '@prisma/client';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseSectionService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course section create successfully',
    data: result,
  });
});

const getAllIntoDb = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, offeredCourseSectionFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await OfferedCourseSectionService.getAllIntoDb(
    filter,
    options
  );
  sendResponse<OfferedCourseSection[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course section create successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection deleted successfully',
    data: result,
  });
});

export const OfferedCourseSectionController = {
  insertIntoDb,
  getAllIntoDb,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
