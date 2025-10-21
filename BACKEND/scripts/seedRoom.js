import mongoose from "mongoose";
import Room from '../models/roomModel.js'
import dotenv from 'dotenv'
dotenv.config()

const sampleRooms = [
    {
        roomNumber: "K-60",
        roomType: 'single', 
        roomGender: 'male', 
        roomPrice: 40000,
        hostelId: "68f69768d90c30186fd54fef",
        bookingPrice: 250000,
        roomDescription: 'This is a nice room',
        maxOccupancy: 3,
    },
    {
        roomNumber: "Luck-456",
        roomType: "double", 
        roomGender: "Both", 
        roomPrice: 60000, 
        hostelId: "68f69768d90c30186fd54ff1", 
        bookingPrice: 300000, 
        roomDescription: 'This is another nice room', 
        maxOccupancy: 2, 
    }
]

const seedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB and ready to seed")

        // Clear existing rooms
         await Room.deleteMany({});
         console.log("Cleared existing rooms");

        const insertRooms = await Room.insertMany(sampleRooms);
        console.log(`Successfully inserted ${insertRooms.length} rooms`)

        insertRooms.forEach(room => {
            console.log(`${room.roomNumber}`)
        })
    } catch (error) {
        console.log(`Error inserting Room: ${error}`)
    } finally {
        await mongoose.connection.close();
        console.log("Database Connection closed")
    }
}

seedRooms()