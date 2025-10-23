import express from 'express';
import validateBooking from '../middleware/validateBooking.js';
import { createBooking, listBookings } from '../controllers/bookingController.js';

const router = express.Router();

// POST /api/bookings - create a new booking
router.post('/', validateBooking, createBooking);

// GET /api/bookings - list all bookings (basic admin/debug)
router.get('/', listBookings);

export default router;
