import express from 'express';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';

const router = express.Router();

router.post('/', OfferedCourseSectionController.insertIntoDb);

export const OfferedCourseSectionRoutes = router;
