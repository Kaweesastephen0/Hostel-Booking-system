// controllers/hostelSearchController.js (CLEAN & DRY VERSION)
import HostelModel from "../models/HostelModel.js";
import roomModel from "../models/roomModel.js";

// Helper function to get price range (DRY)
const getPriceRange = (rooms) => {
  if (!rooms || rooms.length === 0) return { min: 0, max: 0 };
  const prices = rooms.map(r => r.roomPrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Search hostels by location and room type
export const searchHostels = async (req, res) => {
  try {
    const { location, roomType } = req.query;

    // Validate inputs
    if (!location?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }

    // Build hostel query (case-insensitive, partial match)
    const hostelQuery = {
      $or: [
        { location: { $regex: location, $options: 'i' } },
        { address: { $regex: location, $options: 'i' } },
        { name: { $regex: location, $options: 'i' } }
      ],
      availability: true
    };

    // Find matching hostels
    const hostels = await HostelModel.find(hostelQuery).lean();

    if (!hostels || hostels.length === 0) {
      return res.status(200).json({
        success: false,
        message: `No hostels found in ${location}`,
        data: [],
        count: 0
      });
    }

    // Build room query
    const hostelIds = hostels.map(h => h._id);
    const roomQuery = {
      hostelId: { $in: hostelIds }
    };

    // Add room type filter if provided
    if (roomType?.trim()) {
      roomQuery.roomType = { $regex: roomType, $options: 'i' };
    }

    // Find matching rooms
    const availableRooms = await roomModel.find(roomQuery).lean();

    if (!availableRooms || availableRooms.length === 0) {
      return res.status(200).json({
        success: false,
        message: roomType 
          ? `No ${roomType} rooms available in ${location}`
          : `No rooms available in ${location}`,
        data: [],
        count: 0
      });
    }

    // Group rooms by hostel
    const roomsByHostel = availableRooms.reduce((acc, room) => {
      const id = room.hostelId.toString();
      if (!acc[id]) acc[id] = [];
      acc[id].push(room);
      return acc;
    }, {});

    // Combine results and calculate price ranges
    const results = hostels
      .filter(h => roomsByHostel[h._id.toString()])
      .map(hostel => {
        const rooms = roomsByHostel[hostel._id.toString()];
        return {
          ...hostel,
          availableRooms: rooms,
          matchingRoomsCount: rooms.length,
          priceRange: getPriceRange(rooms)
        };
      })
      .sort((a, b) => a.priceRange.min - b.priceRange.min);

    return res.status(200).json({
      success: true,
      count: results.length,
      searchParams: { location, roomType: roomType || 'all' },
      data: results
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all unique locations
export const getLocations = async (req, res) => {
  try {
    const locations = await HostelModel.distinct('location', { 
      availability: true 
    });
    
    return res.status(200).json({
      success: true,
      data: locations.filter(loc => loc?.trim()).sort()
    });
  } catch (error) {
    console.error('Get locations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch locations'
    });
  }
};

// Get all unique room types
export const getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await roomModel.distinct('roomType');
    
    return res.status(200).json({
      success: true,
      data: roomTypes.filter(type => type?.trim()).sort()
    });
  } catch (error) {
    console.error('Get room types error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch room types'
    });
  }
};