import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
  }
};

export const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error listing bookings:', error);
    return res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};
