import express from 'express';
import {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByHostel
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/').get(getAllRooms);
// Place the more specific hostel route before the generic `/:id` route
router.route('/hostel/:hostelId').get(getRoomsByHostel);
router.route('/:id').get(getRoom);

// Protected routes (admin only)
router.route('/').post(protect, authorize('admin'), createRoom);
router.route('/:id')
  .put(protect, authorize('admin'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

export default router;