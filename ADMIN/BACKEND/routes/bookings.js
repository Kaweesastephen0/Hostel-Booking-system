import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/bookings.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
