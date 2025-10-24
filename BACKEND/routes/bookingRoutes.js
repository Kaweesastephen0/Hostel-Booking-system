import express from 'express';
import validateBooking from '../middleware/validateBooking.js';
import { createBooking, listBookings } from '../controllers/bookingController.js';

const router = express.Router();

// creating a new booking
router.post('/book', validateBooking, createBooking);


router.get('/bookings', listBookings);

export default router;
