import express from 'express';
import {
    getActivityLogs,
    getLogsByCategory,
    clearOldLogs,
    createActivityLog
} from '../controllers/activityLogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(getActivityLogs)
    .post(createActivityLog) // Add this line
    .delete(clearOldLogs);

router.route('/:category').get(getLogsByCategory);

export default router;