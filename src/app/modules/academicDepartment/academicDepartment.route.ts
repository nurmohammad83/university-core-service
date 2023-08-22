import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicDepartmentValidation.create),
  AcademicDepartmentController.insertIntoDb
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicDepartmentValidation.update),
  AcademicDepartmentController.updateAcademicDepartment
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AcademicDepartmentController.deleteAcademicDepartment
);
router.get('/', AcademicDepartmentController.getAllDepartments);
export const AcademicDepartmentRoutes = router;
