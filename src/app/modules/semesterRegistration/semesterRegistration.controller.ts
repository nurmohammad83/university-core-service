import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constans';
import { SemesterRegistrationService } from './semesterRegistration.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration created successfully',
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, semesterRegistrationFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await SemesterRegistrationService.getAllFromDB(
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SemesterRegistrations fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
export const SemesterRegistrationController = { insertIntoDb, getAllFromDB };
