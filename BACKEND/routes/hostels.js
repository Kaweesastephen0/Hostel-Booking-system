import express from 'express';
import Hostel from '../models/Hostel.js';

const router = express.Router();

// POST /api/hostels - Create a hostel
router.post('/', async (req, res) => {
  try {
    const { name, description, location } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ success: false, message: 'name, description, and location are required' });
    }

    // Accept either structured object or a simple string for location
    let normalizedLocation = location;
    if (typeof location === 'string') {
      // Minimal mapping: treat string as city, leave required fields with placeholders
      normalizedLocation = {
        address: 'N/A',
        city: location,
        state: 'N/A',
        zipCode: 'N/A',
        coordinates: { latitude: 0, longitude: 0 }
      };
    }

    const hostel = await Hostel.create({ name, description, location: normalizedLocation });
    return res.status(201).json({ success: true, data: hostel });
  } catch (error) {
    console.error('Error creating hostel:', error);
    return res.status(500).json({ success: false, message: 'Error creating hostel', error: error.message });
  }
});

// GET /api/hostels - Get all hostels with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      state, 
      minPrice, 
      maxPrice, 
      roomType, 
      amenities, 
      rating,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    // Handle room type and price filtering
    if (roomType || minPrice || maxPrice) {
      filter['roomTypes'] = {};
      if (roomType) filter['roomTypes.type'] = roomType;
      if (minPrice || maxPrice) {
        filter['roomTypes.price'] = {};
        if (minPrice) filter['roomTypes.price'].$gte = parseFloat(minPrice);
        if (maxPrice) filter['roomTypes.price'].$lte = parseFloat(maxPrice);
      }
    }

    // Handle amenities filtering
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filter.amenities = { $in: amenitiesArray };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const hostels = await Hostel.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    // Get total count for pagination
    const total = await Hostel.countDocuments(filter);

    res.json({
      success: true,
      data: hostels,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalHostels: total,
        hasNext: skip + hostels.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hostels',
      error: error.message
    });
  }
});

// GET /api/hostels/:id - Get single hostel by ID
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    console.error('Error fetching hostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hostel',
      error: error.message
    });
  }
});

// GET /api/hostels/search/:query - Search hostels by name or description
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hostels = await Hostel.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { 'location.city': { $regex: query, $options: 'i' } },
            { 'location.state': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ rating: -1 });

    const total = await Hostel.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { 'location.city': { $regex: query, $options: 'i' } },
            { 'location.state': { $regex: query, $options: 'i' } }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: hostels,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalHostels: total,
        hasNext: skip + hostels.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error searching hostels:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching hostels',
      error: error.message
    });
  }
});

// GET /api/hostels/cities/list - Get list of all cities with hostels
router.get('/cities/list', async (req, res) => {
  try {
    const cities = await Hostel.distinct('location.city', { isActive: true });
    res.json({
      success: true,
      data: cities.sort()
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
});

export default router;

