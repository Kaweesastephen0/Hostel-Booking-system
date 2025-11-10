import express from 'express';
import roomModel from '../models/RoomModel.js';
import { createActivityLog } from '../utils/activityLogger.js';
import Hostel from '../models/HostelModel.js';
import asyncHandler from '../middleware/async.js';

const CATEGORY_THRESHOLDS = {
  luxury: 1200000,
  premium: 1000000,
  standard: 600000
};

const determineHostelCategory = (prices = []) => {
  const validPrices = prices.filter((price) => typeof price === 'number' && !Number.isNaN(price));
  if (validPrices.length === 0) {
    return 'standard';
  }
  const allAffordable = validPrices.every((price) => price < CATEGORY_THRESHOLDS.standard);
  if (allAffordable) {
    return 'budget';
  }
  const maxPrice = Math.max(...validPrices);
  if (maxPrice >= CATEGORY_THRESHOLDS.luxury) {
    return 'luxury';
  }
  if (maxPrice >= CATEGORY_THRESHOLDS.premium) {
    return 'premium';
  }
  return 'standard';
};

const updateHostelCategoryForHostel = async (hostelId) => {
  if (!hostelId) {
    return null;
  }
  const rooms = await roomModel.find({ hostelId }).select('roomPrice').lean();
  const prices = rooms.map((room) => room.roomPrice);
  const category = determineHostelCategory(prices);
  await Hostel.findByIdAndUpdate(hostelId, { category });
  return category;
};

export const getAllRooms = async(req, res) => {
    try {
        let rooms;
        
        if (req.managerFilter) {
            // For managers: use aggregation to filter by room's manager OR hostel's manager
            const managerId = req.managerFilter.manager;
            
            rooms = await roomModel.aggregate([
                {
                    $lookup: {
                        from: 'hostels',
                        localField: 'hostelId',
                        foreignField: '_id',
                        as: 'hostelId'
                    }
                },
                {
                    $unwind: {
                        path: '$hostelId',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        $or: [
                            { manager: managerId },
                            { 'hostelId.manager': managerId }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1,
                        roomNumber: 1,
                        roomType: 1,
                        roomGender: 1,
                        roomPrice: 1,
                        hostelId: 1,
                        manager: 1,
                        bookingPrice: 1,
                        roomDescription: 1,
                        roomImages: 1,
                        maxOccupancy: 1,
                        primaryRoomImage: 1,
                        status: 1,
                        isAvailable: {
                            $eq: ['$status', 'available']
                        },
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);
        } else {
            // For admins: return all rooms
            rooms = await roomModel.find({})
                .populate('hostelId') 
                .lean();
        }
        
        rooms = rooms.map(room => {
            const normalizedStatus = room.status || 'available';
            return {
                ...room,
                status: normalizedStatus,
                isAvailable: room.isAvailable !== undefined ? room.isAvailable : normalizedStatus === 'available'
            };
        });
        
        if (rooms.length > 0) {
            console.log(`found ${rooms.length} rooms`);
        }
        
        res.status(200).json({
            success: true, 
            data: rooms, 
            message: `found ${rooms.length} rooms`
        });

    } catch(error) {
        console.log("Server error", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getRoomsByHostelId = async(req, res) => {
    try {
        const { hostelId } = req.params;
        const { excludeRoomId } = req.query;

        

        if (!hostelId) {
            return res.status(400).json({
                success: false,
                message: "Hostel ID is required"
            });
        }

        const query = { hostelId: hostelId };
        if (excludeRoomId) {
            query._id = { $ne: excludeRoomId };
        }

        // Check all rooms first
        const allRooms = await roomModel.find({}).lean();
       
        
        if (allRooms.length > 0) {
            console.log('First 3 rooms hostelIds:');
            allRooms.slice(0, 3).forEach(room => {
                console.log(`  - ${room.roomNumber}: hostelId = ${room.hostelId}`);
            });
        }

        const rooms = await roomModel.find(query)
            .populate('hostelId')
            .sort({ isShownFirst: -1, createdAt: -1 })
            .limit(3)
            .lean();

        console.log(`✅ Found ${rooms.length} rooms for hostel ${hostelId}`);
        
        if (rooms.length === 0) {
            console.log('No rooms found. Available hostel IDs:');
            const uniqueHostelIds = [...new Set(allRooms.map(r => r.hostelId.toString()))];
            console.log(uniqueHostelIds);
        }
        
        res.status(200).json({
            success: true,
            data: rooms,
            message: `Found ${rooms.length} rooms`
        });

    } catch(error) {
        console.log("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}


export const getRoomById = async(req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        const room = await roomModel.findById(id)
            .populate({
                path: 'hostelId',
                select: 'name location amenities roomImages description HostelGender'
            })
            .lean();

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        console.log(`Found room ${id}`);
        res.status(200).json({
            success: true,
            data: room,
            message: "Room found successfully"
        });
    } catch(error) {
        console.log("Server error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

/**
 * @desc    Get rooms by hostel
 * @route   GET /api/rooms/hostel/:hostelId
 * @access  Public
 */
export const getRoomsByHostel = asyncHandler(async (req, res) => {
  const rooms = await roomModel.find({ hostelId: req.params.hostelId }).populate('hostelId', 'name');

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/**
 * @desc    Create a new room
 * @route   POST /api/rooms
 * @access  Private (Admin, Manager)
 */
export const createRoom = asyncHandler(async (req, res) => {
  // The hostelId should be in the request body
  const { hostelId } = req.body;

  // Check if the hostel exists
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    return res.status(404).json({
      success: false,
      message: `Hostel not found with id of ${hostelId}`
    });
  }

  // Automatically set manager to current user if not provided
  const roomData = {
    ...req.body,
    manager: req.body.manager || req.user._id
  };

  const room = await roomModel.create(roomData);
  await updateHostelCategoryForHostel(hostelId);

  if (req.user) {
    await createActivityLog(
      req.user._id,
      `Created room: ${room.roomNumber}`,
      'room',
      {
        roomId: room._id,
        roomNumber: room.roomNumber,
        hostelId: hostel._id,
        hostelName: hostel.name
      }
    );
  }

  res.status(201).json({
    success: true,
    data: room
  });
});

/**
 * @desc    Update a room
 * @route   PUT /api/rooms/:id
 * @access  Private (Admin, Manager)
 */
export const updateRoom = asyncHandler(async (req, res) => {
  let room = await roomModel.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: `Room not found with id of ${req.params.id}`
    });
  }

  const oldData = { roomNumber: room.roomNumber, roomType: room.roomType, roomPrice: room.roomPrice };

  room = await roomModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  await updateHostelCategoryForHostel(room.hostelId);

  if (req.user) {
    await createActivityLog(
      req.user._id,
      `Updated room: ${room.roomNumber}`,
      'room',
      { roomId: room._id, oldData, newData: { roomNumber: room.roomNumber, roomType: room.roomType, roomPrice: room.roomPrice }, changes: req.body }
    );
  }

  res.status(200).json({ success: true, data: room, message: 'Room updated successfully' });
});

/**
 * @desc    Delete a room
 * @route   DELETE /api/rooms/:id
 * @access  Private (Admin, Manager)
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await roomModel.findById(req.params.id);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: `Room not found with id of ${req.params.id}`
    });
  }

  const roomDataForLog = {
    roomId: room._id,
    roomNumber: room.roomNumber,
    hostelId: room.hostelId
  };

  await room.deleteOne();
  await updateHostelCategoryForHostel(room.hostelId);

  if (req.user) {
    await createActivityLog(req.user._id, `Deleted room: ${room.roomNumber}`, 'room', roomDataForLog);
  }

  res.status(200).json({ success: true, data: {}, message: 'Room deleted successfully' });
});
