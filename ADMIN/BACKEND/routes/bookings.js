import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/bookings.js';
import { getMonthlyStats } from '../controllers/bookingStats.js';

const router = express.Router();

// Stats routes
router.get('/stats/monthly', getMonthlyStats);

// CRUD routes
router.get('/', getBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
