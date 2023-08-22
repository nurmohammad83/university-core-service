import express from 'express';
import { RoomController } from './room.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { RoomValidation } from './room.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoomValidation.create),
  RoomController.insertIntoDb
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoomValidation.update),
  RoomController.updateRoom
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  RoomController.deleteRoom
);
router.get('/:id', RoomController.getSingleToDb);
router.get('/', RoomController.getAllToDb);

export const RoomRoutes = router;
