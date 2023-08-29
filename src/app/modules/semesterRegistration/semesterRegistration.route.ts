import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.post('/', SemesterRegistrationController.insertIntoDb);
router.get('/', SemesterRegistrationController.getAllFromDB);
export const SemesterRegistrationRoutes = router;
