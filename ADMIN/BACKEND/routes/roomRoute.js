import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByHostelId
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getAllRooms)
  .post(protect, authorize('admin'), createRoom);

// Place the more specific hostel route before the generic `/:id` route
router.route('/hostel/:hostelId').get(getRoomsByHostelId);
router.route('/:id').get(getRoomById);

// Protected routes (admin only)
router.route('/:id')
  .put(protect, authorize('admin'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

export default router;