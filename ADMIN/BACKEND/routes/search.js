import express from 'express';
import { globalSearch, searchByType } from '../controllers/searchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/global', globalSearch);
router.get('/:type', searchByType);

export default router;
