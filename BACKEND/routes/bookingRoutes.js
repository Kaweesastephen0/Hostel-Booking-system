import express from 'express';
import { validateBooking } from '../middleware/validateBooking.js';
import { createBooking, listBookings } from '../controllers/bookingController.js';

const router = express.Router();

// Create a new booking
router.post('/book', validateBooking, createBooking);

// Get all bookings
router.get('/bookings', listBookings);

export default router;
