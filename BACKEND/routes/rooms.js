import express from 'express';
import Room from '../models/Room.js';
import Hostel from '../models/Hostel.js';

const router = express.Router();

// POST /api/rooms - create a room
router.post('/', async (req, res) => {
  try {
    const { hostelId, roomNumber, price } = req.body;

    if (!hostelId || !roomNumber || price === undefined) {
      return res.status(400).json({ success: false, message: 'hostelId, roomNumber and price are required' });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ success: false, message: 'Hostel not found' });
    }

    const room = await Room.create({ hostel: hostelId, roomNumber, price });
    return res.status(201).json({ success: true, data: room });
  } catch (error) {
    console.error('Error creating room:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Room with this number already exists for the hostel' });
    }
    return res.status(500).json({ success: false, message: 'Error creating room', error: error.message });
  }
});

export default router;


