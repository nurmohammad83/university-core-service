import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AcademicDepartmentService } from './academicDepartment.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AcademicDepartment } from '@prisma/client';
import { academicDepartmentFilterableFields } from './academicDepartment.constans';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicDepartmentService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AcademicDepartment created successfully',
    data: result,
  });
});

const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, academicDepartmentFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await AcademicDepartmentService.getAllDepartments(
    filters,
    options
  );
  sendResponse<AcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await AcademicDepartmentService.updateAcademicDepartment(
      id,
      payload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'updateAcademicDepartment update successfully',
      data: result,
    });
  }
);

const deleteAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicDepartmentService.deleteAcademicDepartment(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'updateAcademicDepartment delete successfully',
      data: result,
    });
  }
);

export const AcademicDepartmentController = {
  insertIntoDb,
  getAllDepartments,
  updateAcademicDepartment,
  deleteAcademicDepartment,
};
