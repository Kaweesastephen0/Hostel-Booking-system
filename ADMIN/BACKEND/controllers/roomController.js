import Room from '../models/RoomModel.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

/**
 * @desc    Get all rooms, populated with hostel details
 * @route   GET /api/rooms
 * @access  Protected
 */
export const getAllRooms = asyncHandler(async (req, res) => {
  // Build query with manager filter if applicable
  const query = req.managerFilter || {};
  
  const rooms = await Room.find(query).populate('hostelId', 'name');

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/**
 * @desc    Get single room
 * @route   GET /api/rooms/:id
 * @access  Public
 */
export const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate('hostelId', 'name');

  if (!room) {
    throw new ErrorResponse(`Room not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Create new room
 * @route   POST /api/rooms
 * @access  Private (Admin/Manager)
 */
export const createRoom = asyncHandler(async (req, res) => {
  // Set manager to the logged-in user
  const roomData = {
    ...req.body,
    manager: req.user._id
  };
  
  const room = await Room.create(roomData);

  res.status(201).json({
    success: true,
    data: room,
  });
});

export const updateRoom = asyncHandler(async (req, res) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    throw new ErrorResponse(`Room not found with id of ${req.params.id}`, 404);
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('hostelId', 'name');

  res.status(200).json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Delete room
 * @route   DELETE /api/rooms/:id
 * @access  Private
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ErrorResponse(`Room not found with id of ${req.params.id}`, 404);
  }

  await room.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get rooms by hostel
 * @route   GET /api/rooms/hostel/:hostelId
 * @access  Public
 */
export const getRoomsByHostel = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ hostelId: req.params.hostelId }).populate('hostelId', 'name');

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});
