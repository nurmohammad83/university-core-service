import express from 'express';
import { BuildingController } from './building.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingValidation } from './building.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(BuildingValidation.create),
  BuildingController.insertIntoDb
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(BuildingValidation.update),
  BuildingController.updateBuilding
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.deleteBuilding
);
router.get('/:id', BuildingController.getSingleToDb);
router.get('/', BuildingController.getAllToDb);

export const BuildingRoutes = router;
