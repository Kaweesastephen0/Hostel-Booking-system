import Room from '../models/RoomModel.js';

/**
 * @desc    Get all rooms, populated with hostel details
 * @route   GET /api/rooms
 * @access  Public
 */
export const getAllRooms = async (req, res) => {
  try {
    // Find all rooms and populate the 'hostel' field to get hostel details
    const rooms = await Room.find({}).populate('hostel', 'name');

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};