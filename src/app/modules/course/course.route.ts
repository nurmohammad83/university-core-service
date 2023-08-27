import express from 'express';
import { CourseController } from './course.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidation.create),
  CourseController.insertIntoDb
);
router.patch(
  '/:id',
  validateRequest(CourseValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.updateByIdFromDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.deleteByIdFromDB
);
router.get('/:id', CourseController.getSingleCourses);
router.get('/', CourseController.getAllCourses);

router.post('/:id/assign-faculty', CourseController.assignFaculty);
export const CourseRoutes = router;
