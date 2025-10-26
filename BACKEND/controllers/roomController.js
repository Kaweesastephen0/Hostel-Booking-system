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

export const getRoomsByHostelId= async(req, res)=>{
    try{
        const {hostelId} = req.params;
        if(!hostelId){
            return res.status(400).json({
                success: false,
                message: "Hostel ID is required"
            })

        }
        const rooms = await roomModel.find({hostelId: hostelId})
        .populate('hostelId')
        .lean()

        console.log(`Found ${rooms.length} rooms for hostel ${hostelId}`)
        res.status(200).json({
            success: true,
            data: rooms,
            message: `found ${rooms.length} rooms`
        })

    } catch(error){
        console.log("server error", error)
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })

    }

}