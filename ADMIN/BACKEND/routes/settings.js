import express from 'express';
import {
    getSettings,
    updateSettings,
    getMaintenanceStatus,
    toggleMaintenanceMode
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
// Allow both admin and manager to access the main settings endpoints.
// Controllers will enforce what each role can see/update.
router.use(authorize('admin', 'manager'));

router
    .route('/')
    .get(getSettings)
    .put(updateSettings);

router
    .route('/maintenance')
    .get(getMaintenanceStatus)
    .put(toggleMaintenanceMode);

export default router;