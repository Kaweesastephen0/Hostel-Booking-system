import roomModel from '../models/roomModel.js';

/**
 * Categorize hostels by room prices
 * @param {Array} hostelIds - Optional array of hostel IDs to categorize. If null, categorizes all hostels
 * @returns {Object} - Object with hostelId as key and categorization data as value
 */
export const categorizeHostelsByPrice = async (hostelIds = null) => {
    try {
        // Fetch rooms (either all or for specific hostels)
        const query = hostelIds ? { hostelId: { $in: hostelIds } } : {};
        const rooms = await roomModel.find(query).select('hostelId roomPrice').lean();
        
        // Group rooms by hostelId
        const roomsByHostel = rooms.reduce((acc, room) => {
            const hostelId = room.hostelId.toString();
            if (!acc[hostelId]) {
                acc[hostelId] = [];
            }
            acc[hostelId].push(room.roomPrice);
            return acc;
        }, {});

        // Categorize each hostel
        const categories = {};
        
        for (const [hostelId, prices] of Object.entries(roomsByHostel)) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const hasPremiumRoom = prices.some(price => price >= 1000000);
            const allAffordable = prices.every(price => price < 600000);
            
            categories[hostelId] = {
                minPrice,
                maxPrice,
                roomCount: prices.length,
                isPremium: hasPremiumRoom,
                isAffordable: allAffordable && prices.length > 0,
                priceRange: `UGX ${minPrice.toLocaleString()} - UGX ${maxPrice.toLocaleString()}`
            };
        }
        
        console.log(`✅ Categorized ${Object.keys(categories).length} hostels`);
        return categories;
        
    } catch (error) {
        console.error('❌ Error categorizing hostels:', error);
        return {};
    }
};

/**
 * Get room count for a specific hostel
 * @param {String} hostelId - Hostel ID
 * @returns {Number} - Number of rooms
 */
export const getRoomCountByHostelId = async (hostelId) => {
    try {
        const count = await roomModel.countDocuments({ hostelId });
        return count;
    } catch (error) {
        console.error('Error getting room count:', error);
        return 0;
    }
};

/**
 * Get price range for a specific hostel
 * @param {String} hostelId - Hostel ID
 * @returns {Object} - {minPrice, maxPrice, priceRange}
 */
export const getHostelPriceRange = async (hostelId) => {
    try {
        const rooms = await roomModel.find({ hostelId }).select('roomPrice').lean();
        
        if (rooms.length === 0) {
            return { minPrice: 0, maxPrice: 0, priceRange: 'No rooms available' };
        }
        
        const prices = rooms.map(r => r.roomPrice);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        return {
            minPrice,
            maxPrice,
            priceRange: `UGX ${minPrice.toLocaleString()} - UGX ${maxPrice.toLocaleString()}`
        };
    } catch (error) {
        console.error('Error getting price range:', error);
        return { minPrice: 0, maxPrice: 0, priceRange: 'Error fetching prices' };
    }
};