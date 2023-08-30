import express from 'express';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';

const router = express.Router();

router.post('/', OfferedCourseSectionController.insertIntoDb);
router.get('/', OfferedCourseSectionController.getAllIntoDb);
export const OfferedCourseSectionRoutes = router;
