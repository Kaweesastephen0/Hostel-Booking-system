import HostelModel from "../models/HostelModel.js";
import roomModel from "../models/roomModel.js";

// Helper: Get price range from rooms
const getPriceRange = (rooms) => {
  if (!rooms || rooms.length === 0) return { min: 0, max: 0 };
  const prices = rooms.map(r => r.roomPrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// FLEXIBLE SEARCH - Search by any combination of location, roomType, and price
export const searchHostels = async (req, res) => {
  try {
    const { location, roomType, minPrice, maxPrice } = req.query;

    // Check if at least one search parameter is provided
    if (!location?.trim() && !roomType?.trim() && !minPrice && !maxPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one search parameter (location, room type, or price range)'
      });
    }

    // Step 1: Build hostel query (only if location is provided)
    let hostelQuery = { availability: true };
    
    if (location?.trim()) {
      hostelQuery.$or = [
        { location: { $regex: location, $options: 'i' } },
        { name: { $regex: location, $options: 'i' } }
      ];
    }

    // Find matching hostels
    const hostels = await HostelModel.find(hostelQuery).lean();

    if (!hostels || hostels.length === 0) {
      return res.status(200).json({
        success: false,
        message: location ? `No hostels found in ${location}` : 'No hostels found',
        data: [],
        count: 0
      });
    }

    // Step 2: Build room query
    const hostelIds = hostels.map(h => h._id);
    const roomQuery = {
      hostelId: { $in: hostelIds }
    };

    // Add room type filter if provided
    if (roomType?.trim()) {
      roomQuery.roomType = { $regex: roomType, $options: 'i' };
    }

    // Add price range filter if provided
    if (minPrice || maxPrice) {
      roomQuery.roomPrice = {};
      if (minPrice) roomQuery.roomPrice.$gte = Number(minPrice);
      if (maxPrice) roomQuery.roomPrice.$lte = Number(maxPrice);
    }

    // Find matching rooms
    const availableRooms = await roomModel.find(roomQuery).lean();

    if (!availableRooms || availableRooms.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No rooms match your search criteria',
        data: [],
        count: 0
      });
    }

    // Step 3: Group rooms by hostel
    const roomsByHostel = availableRooms.reduce((acc, room) => {
      const id = room.hostelId.toString();
      if (!acc[id]) acc[id] = [];
      acc[id].push(room);
      return acc;
    }, {});

    // Step 4: Combine results
    const results = hostels
      .filter(h => roomsByHostel[h._id.toString()])
      .map(hostel => {
        const rooms = roomsByHostel[hostel._id.toString()];
        const primaryImage = hostel.images?.find(img => img.isPrimary)?.url || hostel.images?.[0]?.url;
        
        return {
          _id: hostel._id,
          name: hostel.name,
          description: hostel.description,
          image: primaryImage,
          location: hostel.location,
          distance: hostel.distance,
          HostelGender: hostel.HostelGender,
          amenities: hostel.amenities,
          rating: hostel.rating,
          featured: hostel.featured,
          availableRooms: rooms,
          matchingRoomsCount: rooms.length,
          priceRange: getPriceRange(rooms)
        };
      })
      .sort((a, b) => a.priceRange.min - b.priceRange.min);

    // Step 5: Return results
    return res.status(200).json({
      success: true,
      count: results.length,
      searchParams: { 
        location: location || 'any', 
        roomType: roomType || 'any',
        minPrice: minPrice || 'any',
        maxPrice: maxPrice || 'any'
      },
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