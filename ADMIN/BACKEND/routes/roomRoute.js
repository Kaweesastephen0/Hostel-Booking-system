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

// Public routes - must be before protect middleware
router.get('/hostel/:hostelId', getRoomsByHostel);
router.get('/:id', getRoom);

// Protected routes - all routes below require authentication
router.use(protect);

// Get all rooms (filtered by manager if not admin)
router.get('/', getAllRooms);

// Create rooms (admin and manager)
router.post('/', authorize('admin', 'manager'), createRoom);

// Update and delete rooms (admin and manager with ownership check)
router.put('/:id', authorize('admin', 'manager'), checkOwnership(Room), updateRoom);
router.delete('/:id', authorize('admin', 'manager'), checkOwnership(Room), deleteRoom);

export default router;