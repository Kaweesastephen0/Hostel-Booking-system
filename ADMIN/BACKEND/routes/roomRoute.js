import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomsByHostelId,
  getRoomsByHostel
} from '../controllers/roomController.js';
import { protect, authorize, checkOwnership, applyManagerFilter, protectDelete } from '../middleware/auth.js';
import Room from '../models/RoomModel.js';

const router = express.Router();

// Public routes - must be before protect middleware
router.get('/hostel/:hostelId', getRoomsByHostel);
router.get('/:id', getRoomById);

// Protected routes - all routes below require authentication
router.use(protect);

// Apply manager filter for viewing rooms
router.use(applyManagerFilter);

// Get all rooms (filtered by manager if not admin)
router.get('/', getAllRooms);

// Create rooms (admin and manager)
router.post('/', authorize('admin', 'manager'), createRoom);

// Update rooms (admin and manager with ownership check)
router.put('/:id', authorize('admin', 'manager'), checkOwnership(Room), updateRoom);

// Delete rooms (admin only - managers cannot delete)
router.delete('/:id', authorize('admin'), checkOwnership(Room), deleteRoom);

export default router;