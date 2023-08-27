import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { FacultyService } from './faculty.service';
import { facultyFilterableFields } from './faculty.constans';

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.createFaculty(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getSingleFaculty(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  });
});
const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await FacultyService.getAllFaculty(filters, options);
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await FacultyService.updateFaculty(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty update successfully',
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.deleteFaculty(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty delete successfully',
    data: result,
  });
});

const assignCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { courses } = req.body;
  const result = await FacultyService.assignCourses(id, courses);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'assign Courses reprieved successfully',
    data: result,
  });
});
const removeAssignCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { courses } = req.body;
  const result = await FacultyService.removeAssignCourses(id, courses);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'remove Assign Courses deleted successfully',
    data: result,
  });
});

export const FacultyController = {
  createFaculty,
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  removeAssignCourses,
  assignCourses,
};
