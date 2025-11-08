import express from 'express';
import {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByHostel
} from '../controllers/roomController.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import Room from '../models/RoomModel.js';

const router = express.Router();

// Public routes
router.route('/hostel/:hostelId').get(getRoomsByHostel);
router.route('/:id').get(getRoom);

// Protected routes - require authentication
router.use(protect);

// Get all rooms (filtered by manager if not admin)
router.route('/').get(getAllRooms);

// Create, update, delete rooms (admin and manager)
router.route('/').post(authorize('admin', 'manager'), createRoom);
router.route('/:id')
  .put(authorize('admin', 'manager'), checkOwnership(Room), updateRoom)
  .delete(authorize('admin', 'manager'), checkOwnership(Room), deleteRoom);

export default router;