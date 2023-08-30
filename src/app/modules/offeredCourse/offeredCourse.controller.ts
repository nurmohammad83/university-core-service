import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OfferedCourseService } from './offeredCourse.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course create successfully',
    data: result,
  });
});

export const OfferedCourseController = {
  insertIntoDb,
};
