import { AcademicSemester } from '@prisma/client';
import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AcademicSemesterService } from './academicSemester.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { academicSemesterFilterableFields } from './academicSemester.constains';

const insetIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSemesterService.insetIntoDb(req.body);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Created Successfully',
    data: result,
  });
});

const getAllToDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, academicSemesterFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await AcademicSemesterService.getAllToDb(filters, options);
  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleToDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSemesterService.getSingleToDb(req.params.id);
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester retrieved Successfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await AcademicSemesterService.updateAcademicSemester(
      id,
      payload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'updateAcademicSemester update successfully',
      data: result,
    });
  }
);

const deleteAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicSemesterService.deleteAcademicSemester(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'deleteAcademicSemester delete successfully',
      data: result,
    });
  }
);

export const AcademicSemesterController = {
  insetIntoDb,
  getAllToDb,
  getSingleToDb,
  deleteAcademicSemester,
  updateAcademicSemester,
};
