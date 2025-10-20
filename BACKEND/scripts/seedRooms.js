import mongoose from "mongoose";
import Room from '../models/roomModel.js'
import dotenv from 'dotenv'
dotenv.config()

const sampleRooms =[
    {
        roomNumber : "K-60",
        roomType: 'single',
        roomGender: 'male',
        roomPrice: 40000,
        hostelId: "68eb86ce6a7d34b69e9e7411",
        bookingPrice: 2500000,
        roomDescription: 'This is a nice room',
        maxOccupancy: 3,

    
    }
]

const seedRooms= async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB and ready to seed")

        const insertRooms = await Room.insertMany(sampleRooms);
        console.log(` successfully inserted ${insertRooms.length} rooms`)

        insertRooms.forEach(room =>{
            console.log(`${room.roomNumber}`)
        })
    } catch(error){
        console.log(`Error inserting Room, ${error}`)
    } finally {
        await mongoose.connection.close();
        console.log("Database Connection closed")
    }
    
}

seedRooms()