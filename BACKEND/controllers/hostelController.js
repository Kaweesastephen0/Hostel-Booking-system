import { Query } from "mongoose";
import HostelModel from "../models/HostelModel.js";
import roomModel from "../models/roomModel.js";
import { categorizeHostelsByPrice } from "../utils/hostelCategorization.js";


// GET ALL HOSTELS
export const getAllHostels = async(req, res) => {
    try {
        const hostels = await HostelModel.find({}).lean();
        
        console.log(`Found ${hostels.length} hostels`);

        res.status(200).json({ 
            success: true, 
            data: hostels, 
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


// GET FEATURED HOSTELS
export const getFeaturedHostels = async(req, res) => {
    try {
        const featuredHostels = await HostelModel.find({featured: true}).lean();
        
        console.log(`Found ${featuredHostels.length} featured hostels`);

        res.status(200).json({
            success: true, 
            data: featuredHostels, 
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

// GET PREMIUM HOSTELS (rooms >= 1,000,000)
export const getPremiumHostels = async(req, res) => {
    try {
        console.log('Fetching premium hostels...');
        
        const allHostels = await HostelModel.find({}).lean();
        console.log(`Total hostels fetched: ${allHostels.length}`);
        
        // Get categorization for all hostels
        const categories = await categorizeHostelsByPrice();
        
        // Filter only premium hostels
        const premiumHostels = allHostels.filter(hostel => {
            const hostelId = hostel._id.toString();
            const category = categories[hostelId];
            
            if (!category) {
                console.log(`${hostel.name}: No rooms found`);
                return false;
            }
            
            console.log(`${hostel.name}: Min=${category.minPrice}, Max=${category.maxPrice}, Premium=${category.isPremium}`);
            return category.isPremium;
        });

        console.log(`Found ${premiumHostels.length} premium hostels`);

        if (premiumHostels.length > 0) {
            res.status(200).json({
                message: `Found ${premiumHostels.length} premium hostels`, 
                success: true, 
                data: premiumHostels
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


// GET AFFORDABLE HOSTELS (all rooms < 600,000)
export const getAffordableHostels = async (req, res) => {
    try {
        console.log('Fetching affordable hostels (below 600,000 UGX)...');
        
        const allHostels = await HostelModel.find({}).lean();
        console.log(`Total hostels in database: ${allHostels.length}`);
        
        if (allHostels.length === 0) {
            return res.status(404).json({
                success: false, 
                message: 'No hostels found in database',
                data: []
            });
        }
        
        // Get categorization for all hostels
        const categories = await categorizeHostelsByPrice();
        
        // Filter only affordable hostels
        const affordableHostels = allHostels.filter(hostel => {
            const hostelId = hostel._id.toString();
            const category = categories[hostelId];
            
            if (!category) {
                console.log(`${hostel.name}: No rooms found`);
                return false;
            }
            
            console.log(`${hostel.name}: ${category.roomCount} rooms, Max=${category.maxPrice}, Affordable=${category.isAffordable}`);
            return category.isAffordable;
        });

        console.log(`Found ${affordableHostels.length} affordable hostels`);

        if (affordableHostels.length > 0) {
            console.log('Affordable hostels:');
            affordableHostels.forEach(hostel => {
                const category = categories[hostel._id.toString()];
                console.log(`${hostel.name}: ${category.priceRange}`);
            });
            
            res.status(200).json({
                success: true, 
                data: affordableHostels, 
                message: `Found ${affordableHostels.length} affordable hostels`
            });
        } else {
            console.log('No affordable hostels found');
            res.status(404).json({
                success: false, 
                message: 'No affordable hostels found',
                data: []
            });
        }
        
    } catch(error) {
        console.log('Error getting affordable hostels:', error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// GET MID-RANGE HOSTELS (600,000 <= rooms < 1,000,000)
export const getMidRangeHostels = async (req, res) => {
    try {
        console.log('Fetching mid-range hostels (600,000 - 999,999 UGX)...');
        
        const allHostels = await HostelModel.find({}).lean();
        console.log(`Total hostels in database: ${allHostels.length}`);
        
        if (allHostels.length === 0) {
            return res.status(404).json({
                success: false, 
                message: 'No hostels found in database',
                data: []
            });
        }
        
        // Get categorization for all hostels
        const categories = await categorizeHostelsByPrice();
        
        // Filter only mid-range hostels
        const midRangeHostels = allHostels.filter(hostel => {
            const hostelId = hostel._id.toString();
            const category = categories[hostelId];
            
            if (!category) {
                console.log(`${hostel.name}: No rooms found`);
                return false;
            }
            
            // Mid-range: Has at least one room >= 600k AND no room >= 1M
            const hasMidRangeRoom = category.minPrice >= 600000 || category.maxPrice >= 600000;
            const isMidRange = hasMidRangeRoom && !category.isPremium;
            
            console.log(`${hostel.name}: Min=${category.minPrice}, Max=${category.maxPrice}, MidRange=${isMidRange}`);
            return isMidRange;
        });

        console.log(`Found ${midRangeHostels.length} mid-range hostels`);

        if (midRangeHostels.length > 0) {
            console.log(' Mid-range hostels:');
            midRangeHostels.forEach(hostel => {
                const category = categories[hostel._id.toString()];
                console.log(` ${hostel.name}: ${category.priceRange}`);
            });
            
            res.status(200).json({
                success: true, 
                data: midRangeHostels, 
                message: `Found ${midRangeHostels.length} mid-range hostels`
            });
        } else {
            console.log(' No mid-range hostels found');
            res.status(404).json({
                success: false, 
                message: 'No mid-range hostels found',
                data: []
            });
        }
        
    } catch(error) {
        console.log(' Error getting mid-range hostels:', error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// Add this to your existing hostelController.js
export const getSearchbarQuery = async (req, res) => {
    try {
        const { location, roomType, minPrice, maxPrice } = req.query;

        console.log("🔍 SEARCH STARTED - Params:", { location, roomType, minPrice, maxPrice });

        // At least ONE field required
        if (!location && !roomType && !minPrice && !maxPrice) {
            console.log("❌ No search criteria provided");
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one search criteria',
            });
        }

        let hostels = [];

        // LOCATION SEARCH
        if (location && location.trim()) {
            const searchTerm = location.trim().toLowerCase();
            console.log(`📍 Searching for location: "${searchTerm}"`);
            
            const allHostels = await HostelModel.find({}).lean();
            console.log(`📊 Total hostels in DB: ${allHostels.length}`);
            
            hostels = allHostels.filter(hostel => {
                const hostelLocation = (hostel.location || '').toLowerCase();
                const hostelName = (hostel.name || '').toLowerCase();
                
                const matches = hostelLocation.includes(searchTerm) || hostelName.includes(searchTerm);
                if (matches) {
                    console.log(`✅ Matched hostel: ${hostel.name} (${hostel.location})`);
                }
                return matches;
            });
            
            console.log(`📍 Location search found: ${hostels.length} hostels`);
        } else {
            hostels = await HostelModel.find({}).lean();
            console.log(`📊 No location filter, using all: ${hostels.length} hostels`);
        }

        if (hostels.length === 0) {
            console.log("❌ No hostels found after location filter");
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No hostels found',
                count: 0
            });
        }

        // Get rooms for these hostels
        const hostelIds = hostels.map(h => h._id);
        console.log(`🏨 Hostel IDs to search: ${hostelIds.length}`);
        
        const roomQuery = { hostelId: { $in: hostelIds } };
        const allRooms = await roomModel.find(roomQuery).lean();
        console.log(`🛏️ Found ${allRooms.length} rooms for these hostels`);

        // Apply room type filter
        let filteredRooms = allRooms;
        if (roomType && roomType.trim()) {
            const roomTypeLower = roomType.trim().toLowerCase();
            console.log(`🔍 Filtering by room type: "${roomTypeLower}"`);
            
            filteredRooms = allRooms.filter(room => 
                (room.roomType || '').toLowerCase().includes(roomTypeLower)
            );
            console.log(`🛏️ After room type filter: ${filteredRooms.length} rooms`);
        }

        // Apply price filter
        if (minPrice || maxPrice) {
            console.log(`💰 Price filter: ${minPrice || 'none'} - ${maxPrice || 'none'}`);
            filteredRooms = filteredRooms.filter(room => {
                const price = room.roomPrice;
                if (minPrice && price < Number(minPrice)) return false;
                if (maxPrice && room.roomPrice > Number(maxPrice)) return false;
                return true;
            });
            console.log(`🛏️ After price filter: ${filteredRooms.length} rooms`);
        }

        // Build results
        const hostelRoomMap = {};
        filteredRooms.forEach(room => {
            const hostelId = room.hostelId.toString();
            if (!hostelRoomMap[hostelId]) {
                hostelRoomMap[hostelId] = {
                    rooms: [],
                    minPrice: room.roomPrice,
                    maxPrice: room.roomPrice
                };
            }
            hostelRoomMap[hostelId].rooms.push(room);
            hostelRoomMap[hostelId].minPrice = Math.min(hostelRoomMap[hostelId].minPrice, room.roomPrice);
            hostelRoomMap[hostelId].maxPrice = Math.max(hostelRoomMap[hostelId].maxPrice, room.roomPrice);
        });

        const results = hostels
            .filter(hostel => hostelRoomMap[hostel._id.toString()])
            .map(hostel => {
                const hostelId = hostel._id.toString();
                const roomData = hostelRoomMap[hostelId];
                return {
                    ...hostel,
                    matchingRoomsCount: roomData.rooms.length,
                    priceRange: {
                        min: roomData.minPrice,
                        max: roomData.maxPrice
                    }
                };
            });

        console.log(`🎯 FINAL RESULTS: ${results.length} hostels`);
        results.forEach(hostel => {
            console.log(`   - ${hostel.name}: ${hostel.matchingRoomsCount} rooms, UGX ${hostel.priceRange.min.toLocaleString()} - UGX ${hostel.priceRange.max.toLocaleString()}`);
        });

        return res.status(200).json({
            success: true,
            data: results,
            message: `Found ${results.length} hostel(s)`,
            count: results.length
        });

    } catch (error) {
        console.error("❌ SEARCH ERROR:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};