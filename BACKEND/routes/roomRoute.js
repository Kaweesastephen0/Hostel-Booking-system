import express from 'express'
import Rooms from '../models/roomModel.js'
import router from './hostelRoute'

const router =router();

router.get('/', async(req, res)=>{
    try{
        const rooms = await Rooms.find({});
        if(rooms.length > 0){
            console.log(`found ${rooms.length} rooms`)

        }
       res.status(200).json({message: "fetched successfully"})
    }catch(error){
        console.error('failed to fetch rooms: ', error)
        res.status(500).json({message: "Server Error"})

    }
})