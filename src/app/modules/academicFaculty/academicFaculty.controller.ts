import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AcademicFacultyService } from './academicFaculty.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.insetIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty created successfully',
    data: result,
  });
});

const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'title']);
  const options = pick(req.query, paginationFields);
  const result = await AcademicFacultyService.getAllFaculty(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty retrieved successfully',
    data: result,
  });
});

const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.getSingleFaculty(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicFaculty retrieved successfully',
    data: result,
  });
});

const updateAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await AcademicFacultyService.updateAcademicFaculty(
      id,
      payload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'updateAcademicFaculty update successfully',
      data: result,
    });
  }
);

const deleteAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicFacultyService.deleteAcademicFaculty(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'updateAcademicFaculty delete successfully',
      data: result,
    });
  }
);

export const AcademicFacultyController = {
  insertIntoDb,
  getAllFaculty,
  getSingleFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
