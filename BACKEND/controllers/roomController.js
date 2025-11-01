import express from 'express';
import roomModel from '../models/roomModel.js';

export const getAllRooms = async(req, res) => {
    try {
        const rooms = await roomModel.find({})
            .populate('hostelId') 
            .lean();
        
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
        console.log("Server error", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}