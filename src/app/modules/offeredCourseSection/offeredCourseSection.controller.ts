import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionService } from './offeredCourseSection.service';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseSectionService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course section create successfully',
    data: result,
  });
});

export const OfferedCourseSectionController = {
  insertIntoDb,
};
