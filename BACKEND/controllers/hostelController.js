import HostelModel from "../models/HostelModel.js";

export const getAllHostels = async(req, res) => {
    try {
        const hostels = await HostelModel.find({})
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
        
        // Filter hostels that have rooms >= 1,000,000
        const premiumHostels = allHostels.filter(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const maxPrice = roomPrices.length > 0 ? Math.max(...roomPrices) : 0;
            return maxPrice >= 1000000;
        });

        // Add price information - show PREMIUM price instead of starting price
        const hostelsWithPrices = premiumHostels.map(hostel => {
            const roomPrices = hostel.rooms?.map(room => room.roomPrice) || [];
            const premiumPrice = roomPrices.length > 0 ? Math.max(...roomPrices) : 0;
            const premiumRooms = hostel.rooms?.filter(room => room.roomPrice >= 1000000) || [];
            
            return {
                ...hostel,
                roomPrice: premiumPrice, // Show the premium price instead of starting price
                premiumRoomsCount: premiumRooms.length,
                priceRange: roomPrices.length > 0 ? 
                    `UGX ${Math.min(...roomPrices).toLocaleString()} - UGX ${Math.max(...roomPrices).toLocaleString()}` : 
                    'No rooms available',
                availableRooms: hostel.rooms?.length || 0
            };
        });

        if (premiumHostels.length > 0) {
            console.log(`Found ${premiumHostels.length} premium hostels`);
            res.status(200).json({
                message: `Found ${premiumHostels.length} premium hostels`, 
                success: true, 
                data: hostelsWithPrices
            });
        } else {
            console.log('No premium hostels found');
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

