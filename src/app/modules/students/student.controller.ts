import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentService } from './student.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { studentFilterableFields } from './student.constans';
import { paginationFields } from '../../../constants/pagination';
import { Student } from '@prisma/client';

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.createStudent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getSingleStudent(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  });
});
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await StudentService.getAllStudents(filters, options);
  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await StudentService.updateStudent(id, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student update successfully',
    data: result,
  });
});
const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student delete successfully',
    data: result,
  });
});
export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
