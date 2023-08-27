import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';
import { FacultyController } from './faculty.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.create),
  FacultyController.createFaculty
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.update),
  FacultyController.updateFaculty
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteFaculty
);
router.get('/:id', FacultyController.getSingleFaculty);
router.get('/', FacultyController.getAllFaculty);

router.post(
  '/:id/assign-course',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  FacultyController.assignCourses
);
router.delete(
  '/:id/remove-course',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  FacultyController.removeAssignCourses
);
export const FacultyRoutes = router;
