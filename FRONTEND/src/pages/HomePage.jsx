// ============================================
// BACKEND: controllers/searchController.js
// ============================================
export const getSearchbarQuery = async (req, res) => {
    try {
        const { location, roomType, minPrice, maxPrice } = req.query;

        console.log("Search params received:", { location, roomType, minPrice, maxPrice });

        // At least ONE field required
        if (!location && !roomType && !minPrice && !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one search criteria',
            });
        }

        const query = {};

        // LOCATION SEARCH
        if (location && location.trim()) {
            query.$or = [
                { location: { $regex: location.trim(), $options: 'i' } },
                { address: { $regex: location.trim(), $options: 'i' } },
                { name: { $regex: location.trim(), $options: 'i' } }
            ];
        }

        let hostels = await HostelModel.find(query).lean();
        console.log("Hostels found:", hostels.length);

        if (!hostels || hostels.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No hostels found',
                count: 0
            });
        }

        const hostelIds = hostels.map(h => h._id);
        const roomQuery = { hostelId: { $in: hostelIds } };

        // ROOM TYPE FILTER
        if (roomType && roomType.trim()) {
            roomQuery.roomType = { $regex: roomType.trim(), $options: 'i' };
        }

        // PRICE FILTER
        if (minPrice || maxPrice) {
            roomQuery.price = {};
            if (minPrice) roomQuery.price.$gte = Number(minPrice);
            if (maxPrice) roomQuery.price.$lte = Number(maxPrice);
        }

        const matchingRooms = await RoomModel.find(roomQuery).lean();
        console.log("Matching rooms:", matchingRooms.length);

        if (!matchingRooms || matchingRooms.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No rooms found matching your criteria',
                count: 0
            });
        }

        const hostelRoomMap = {};
        matchingRooms.forEach(room => {
            const hostelId = room.hostelId.toString();
            if (!hostelRoomMap[hostelId]) {
                hostelRoomMap[hostelId] = {
                    rooms: [],
                    minPrice: room.price,
                    maxPrice: room.price
                };
            }
            hostelRoomMap[hostelId].rooms.push(room);
            hostelRoomMap[hostelId].minPrice = Math.min(hostelRoomMap[hostelId].minPrice, room.price);
            hostelRoomMap[hostelId].maxPrice = Math.max(hostelRoomMap[hostelId].maxPrice, room.price);
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
                    },
                    availableRoomTypes: [...new Set(roomData.rooms.map(r => r.roomType))]
                };
            });

        console.log("Final results:", results.length);

        return res.status(200).json({
            success: true,
            data: results,
            message: `Found ${results.length} hostel(s)`,
            count: results.length
        });

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// ============================================
// FRONTEND: hooks/useHostelSearch.js
// ============================================
import { useState } from 'react';
import axios from 'axios';

export const useHostelSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHostels = async (searchParams) => {
    try {
      console.log("Searching with params:", searchParams);
      
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (searchParams.location?.trim()) {
        params.append('location', searchParams.location.trim());
      }
      if (searchParams.roomType?.trim()) {
        params.append('roomType', searchParams.roomType.trim());
      }
      if (searchParams.minPrice) {
        params.append('minPrice', searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        params.append('maxPrice', searchParams.maxPrice);
      }

      console.log("API URL:", `/api/search?${params.toString()}`);

      const response = await axios.get(`/api/search?${params.toString()}`);

      console.log("API Response:", response.data);

      if (response.data.success) {
        setResults(response.data.data || []);
      } else {
        setError(response.data.message || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchHostels };
};



import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedHostels from '../components/hostels/sections/FeaturedHostels';
import AffordableHostels from '../components/hostels/sections/AffordableHostels';
import MidRangeHostels from '../components/hostels/sections/MidRangeHostels';
import Hero from '../components/layout/hero/Hero';
import BelowSection from '../components/hostels/sections/belowSection/belowSection';


function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (searchParams) => {
    console.log("HomePage received search params:", searchParams);
    
    // Navigate to search results page
    navigate('/search-results', { 
      state: { searchParams } 
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Hero onSearch={handleSearch} />
      <FeaturedHostels />
      <MidRangeHostels />
      <AffordableHostels />
      <BelowSection />
    </div>
  );
}

export default HomePage;


