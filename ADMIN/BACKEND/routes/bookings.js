import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/bookings.js';
import { getMonthlyStats } from '../controllers/bookingStats.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Protected routes - all booking routes require authentication
router.use(protect);

// Stats routes
router.get('/stats/monthly', getMonthlyStats);

// CRUD routes - accessible by both admin and manager
router.get('/', getBookings);
router.post('/', authorize('admin', 'manager'), createBooking);
router.get('/:id', getBookingById);

// Update and delete require ownership check for managers
router.put('/:id', authorize('admin', 'manager'), checkOwnership(Booking), updateBooking);
router.delete('/:id', authorize('admin', 'manager'), checkOwnership(Booking), deleteBooking);

export default router;
