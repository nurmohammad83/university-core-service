import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CourseService } from './course.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { courseFilterableFields } from './course.constans';
import { paginationFields } from '../../../constants/pagination';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course create successfully',
    data: result,
  });
});
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, courseFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await CourseService.getAllCourses(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getSingleCourse(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  });
});
const updateByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await CourseService.updateByIdFromDB(id, updateData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course update successfully',
    data: result,
  });
});
const assignFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { faculties } = req.body;
  console.log(faculties);
  const result = await CourseService.assignFaculty(id, faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'assignFaculty retrievid successfully',
    data: result,
  });
});
const removeAssignFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { faculties } = req.body;
  console.log(faculties);
  const result = await CourseService.removeAssignFaculty(id, faculties);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'remove Assign Faculty deleted successfully',
    data: result,
  });
});

export const CourseController = {
  insertIntoDb,
  assignFaculty,
  getAllCourses,
  getSingleCourses,
  updateByIdFromDB,
  deleteByIdFromDB,
  removeAssignFaculty,
};
