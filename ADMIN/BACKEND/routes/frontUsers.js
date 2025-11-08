import express from 'express';
import {
  getAllFrontUsers,
  getFrontUser,
  updateFrontUser,
  deleteFrontUser
} from '../controllers/frontUsersController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getAllFrontUsers);
router.route('/:id').get(getFrontUser).put(updateFrontUser).delete(deleteFrontUser);

export default router;
