import HostelModel from "../models/HostelModel.js";
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

export const createHostel = asyncHandler(async (req, res) => {
  // Set manager to the logged-in user
  const hostelData = {
    ...req.body,
    manager: req.user._id
  };
  
  const hostel = await HostelModel.create(hostelData);
  
  res.status(201).json({
    success: true,
    data: hostel,
    message: 'Hostel created successfully'
  });
});

export const getHostel = asyncHandler(async (req, res) => {
  const hostel = await HostelModel.findById(req.params.id).populate('rooms');
  
  if (!hostel) {
    throw new ErrorResponse(`Hostel not found with id of ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: hostel
  });
});

export const updateHostel = asyncHandler(async (req, res) => {
  let hostel = await HostelModel.findById(req.params.id);

  if (!hostel) {
    throw new ErrorResponse(`Hostel not found with id of ${req.params.id}`, 404);
  }

  hostel = await HostelModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: hostel,
    message: 'Hostel updated successfully'
  });
});

export const deleteHostel = asyncHandler(async (req, res) => {
  const hostel = await HostelModel.findById(req.params.id);

  if (!hostel) {
    throw new ErrorResponse(`Hostel not found with id of ${req.params.id}`, 404);
  }

  await hostel.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Hostel deleted successfully'
  });
});

export const getAllHostels = async(req, res) => {
    try {
        // Apply manager filter if present
        const query = req.managerFilter || {};
        
        const hostels = await HostelModel.find(query)
            .populate('rooms')
            .lean();
        
        console.log(`Found ${hostels.length} hostels`);

        // Add price information to each hostel
        const hostelsWithPrices = hostels.map(hostel => {
            // Get all room prices from populated rooms
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            
            // Calculate starting price (minimum room price)
            const startingPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 0;
            
            // Calculate price range
            const priceRange = roomPrices.length > 0 ? 
                `UGX ${Math.min(...roomPrices).toLocaleString()} - UGX ${Math.max(...roomPrices).toLocaleString()}` : 
                'No rooms available';
            
            // Debug log for first hostel
            if (hostel.name === "Sun ways Hostel") {
                console.log('Sun ways Hostel debug:');
                console.log('Rooms count:', hostel.rooms?.length);
                console.log('Room prices:', roomPrices);
                console.log('Starting price:', startingPrice);
            }
            
            return {
                ...hostel,
                roomPrice: startingPrice, // This is the key field for frontend
                priceRange,
                availableRooms: hostel.rooms?.length || 0
            };
        });

        console.log('First hostel with prices:', JSON.stringify(hostelsWithPrices[0], null, 2));

        res.status(200).json({ 
            success: true, 
            data: hostelsWithPrices, 
            message: `Fetched ${hostels.length} hostels` 
        });
        
    } catch (error) {
        console.log('Error fetching Hostels:', error);
        res.status(500).json({
            success: false, 
            error: error.message, 
            message: "Error fetching Hostels"
        });
    }
};

export const getFeaturedHostels = async(req, res) => {
    try {
        const featuredHostels = await HostelModel.find({featured: true})
            .populate('rooms')
            .lean();
        
        console.log(`Found ${featuredHostels.length} featured hostels`);

        // Add price information to featured hostels
        const hostelsWithPrices = featuredHostels.map(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const startingPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 0;
            const priceRange = roomPrices.length > 0 ? 
                `UGX ${Math.min(...roomPrices).toLocaleString()} - UGX ${Math.max(...roomPrices).toLocaleString()}` : 
                'No rooms available';
            
            return {
                ...hostel,
                roomPrice: startingPrice,
                priceRange,
                availableRooms: hostel.rooms?.length || 0
            };
        });

        res.status(200).json({
            success: true, 
            data: hostelsWithPrices, 
            message: `Found ${featuredHostels.length} featured hostels`
        });
        
    } catch(error) {
        console.log('Error fetching featured hostels:', error);
        res.status(500).json({
            success: false, 
            message: 'Server error', 
            error: error.message
        });
    }
};

export const getPremiumHostels = async(req, res) => {
    try {
        const allHostels = await HostelModel.find({})
            .populate('rooms')
            .lean();
        
        console.log(`Total hostels fetched: ${allHostels.length}`);
        
        // Filter hostels that have AT LEAST ONE room >= 1,000,000
        const premiumHostels = allHostels.filter(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const hasPremiumRoom = roomPrices.some(price => price >= 1000000);
            
            // Debug log for each hostel
            console.log(`Hostel: ${hostel.name}, Rooms: ${hostel.rooms?.length}, Prices: [${roomPrices.join(', ')}], Has Premium: ${hasPremiumRoom}`);
            
            return hasPremiumRoom;
        });

        console.log(`Premium hostels after filtering: ${premiumHostels.length}`);

        // Add price information - MAINTAIN CONSISTENCY with other endpoints
        const hostelsWithPrices = premiumHostels.map(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const startingPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 0;
            const premiumRooms = hostel.rooms?.filter(room => room.roomPrice >= 1000000) || [];
            
            // Debug info
            console.log(`Processing ${hostel.name}:`);
            console.log(`  - All room prices: [${roomPrices.join(', ')}]`);
            console.log(`  - Starting price: ${startingPrice}`);
            console.log(`  - Premium rooms count: ${premiumRooms.length}`);
            console.log(`  - Premium room prices: [${premiumRooms.map(r => r.roomPrice).join(', ')}]`);
            
            return {
                ...hostel,
                roomPrice: startingPrice, // Keep consistent with other endpoints
                premiumPrice: Math.max(...roomPrices), // Add separate premium price field
                premiumRoomsCount: premiumRooms.length,
                priceRange: roomPrices.length > 0 ? 
                    `UGX ${Math.min(...roomPrices).toLocaleString()} - UGX ${Math.max(...roomPrices).toLocaleString()}` : 
                    'No rooms available',
                availableRooms: hostel.rooms?.length || 0,
                isPremium: true // Add flag to identify premium hostels
            };
        });

        if (premiumHostels.length > 0) {
            console.log(`✅ Found ${premiumHostels.length} premium hostels`);
            console.log('Premium hostels details:');
            hostelsWithPrices.forEach(hostel => {
                console.log(`   🏨 ${hostel.name}: ${hostel.premiumRoomsCount} premium rooms, Price range: ${hostel.priceRange}`);
            });
            
            res.status(200).json({
                message: `Found ${premiumHostels.length} premium hostels`, 
                success: true, 
                data: hostelsWithPrices
            });
        } else {
            console.log('❌ No premium hostels found');
            // Let's debug why no hostels are being found
            const allRoomPrices = allHostels.flatMap(hostel => 
                hostel.rooms?.map(room => ({ hostel: hostel.name, price: room.roomPrice })) || []
            );
            console.log('All room prices across all hostels:', allRoomPrices);
            
            res.status(404).json({
                success: false, 
                message: 'No premium hostels found',
                data: []
            });
        }
        
    } catch(error) {
        console.log('Error getting premium hostels:', error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getAffordableHostels = async (req, res) => {
    try {
        console.log('🔍 Fetching affordable hostels (below 600,000 UGX)...');
        
        // First, let's check if HostelModel is defined
        if (!HostelModel) {
            throw new Error('HostelModel is not defined - check import statement');
        }
        
        const allHostels = await HostelModel.find({})
            .populate('rooms')
            .lean();
        
        console.log(`📊 Total hostels in database: ${allHostels.length}`);
        
        if (allHostels.length === 0) {
            console.log('❌ No hostels found in database');
            return res.status(404).json({
                success: false, 
                message: 'No hostels found in database',
                data: []
            });
        }
        
        // Filter hostels that have ALL rooms below 600,000 UGX
        const affordableHostels = allHostels.filter(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const hasAffordableRooms = roomPrices.length > 0 && 
                                     roomPrices.every(price => price < 600000);
            
            console.log(`🏨 ${hostel.name}: ${roomPrices.length} rooms, Max price: ${roomPrices.length > 0 ? Math.max(...roomPrices) : 0}, Affordable: ${hasAffordableRooms}`);
            
            return hasAffordableRooms;
        });

        console.log(`💰 Found ${affordableHostels.length} affordable hostels`);

        // Add price information
        const hostelsWithPrices = affordableHostels.map(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const startingPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 0;
            
            return {
                ...hostel,
                roomPrice: startingPrice,
                priceRange: roomPrices.length > 0 ? 
                    `UGX ${Math.min(...roomPrices).toLocaleString()} - UGX ${Math.max(...roomPrices).toLocaleString()}` : 
                    'No rooms available',
                availableRooms: hostel.rooms?.length || 0
            };
        });

        // Log details for debugging
        console.log('✅ Affordable hostels found:');
        hostelsWithPrices.forEach(hostel => {
            console.log(`   🏠 ${hostel.name}: ${hostel.priceRange}`);
        });

        if (affordableHostels.length > 0) {
            res.status(200).json({
                success: true, 
                data: hostelsWithPrices, 
                message: `Found ${affordableHostels.length} affordable hostels (all rooms below 600,000 UGX)`
            });
        } else {
            console.log('❌ No affordable hostels found');
            res.status(404).json({
                success: false, 
                message: 'No affordable hostels found (all rooms below 600,000 UGX)',
                data: []
            });
        }
        
    } catch(error) {
        console.log('❌ Error getting affordable hostels:', error);
        console.log('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};
