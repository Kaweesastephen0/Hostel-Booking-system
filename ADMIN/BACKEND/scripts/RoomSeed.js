import mongoose from "mongoose";
import Room from '../models/RoomModel.js'
import dotenv from 'dotenv'
dotenv.config()

const sampleRooms = [
    {
        // Olympia Hostel
        hostel: "668f69768d90c30186fd54f0", 
        roomNumber: 'A101',
        roomType: 'single',
        roomGender: 'female',
        roomPrice: 1200000,
        bookingPrice: 50000,
        roomDescription: 'A premium single room with a balcony and a great view of the city.',
        maxOccupancy: 1,
    },
    {
        hostel: "668f69768d90c30186fd54f0", // Olympia Hostel
        roomNumber: 'A102',
        roomType: 'double',
        roomGender: 'female',
        roomPrice: 850000,
        bookingPrice: 50000,
        roomDescription: 'Spacious double room, perfect for sharing with a friend.',
        maxOccupancy: 2,
    },
    {
        // Nana Hostel
        hostel: "668f69768d90c30186fd54f1", 
        roomNumber: 'B205',
        roomType: 'single',
        roomGender: 'female',
        roomPrice: 950000,
        bookingPrice: 40000,
        roomDescription: 'A comfortable and quiet single room for focused students.',
        maxOccupancy: 1,
    },
    {
        // Akamwesi Hostel
        hostel: "668f69768d90c30186fd54f2", 
        roomNumber: 'C310',
        roomType: 'double',
        roomGender: 'male',
        roomPrice: 800000,
        bookingPrice: 35000,
        roomDescription: 'Well-ventilated double room with modern furnishings.',
        maxOccupancy: 2,
    },
    {
        // Douglas Villa
        hostel: "668f69768d90c30186fd54f3", 
        roomNumber: 'D112',
        roomType: 'single',
        roomGender: 'male',
        roomPrice: 750000,
        bookingPrice: 30000,
        roomDescription: 'An affordable and secure single room, close to the west gate.',
        maxOccupancy: 1,
    },
    {
        // Prestige Hostel
        hostel: "668f69768d90c30186fd54f4", 
        roomNumber: 'E401',
        roomType: 'single',
        roomGender: 'female',
        roomPrice: 1100000,
        bookingPrice: 50000,
        roomDescription: 'Luxury single room with premium amenities and services.',
        maxOccupancy: 1,
    },
    {
        // Sun ways Hostel
        hostel: "668f69768d90c30186fd54ee",
        roomNumber: 'S101',
        roomType: 'shared',
        roomGender: 'male',
        roomPrice: 550000,
        bookingPrice: 25000,
        roomDescription: 'A budget-friendly shared room for up to 4 occupants.',
        maxOccupancy: 4,
    },
    {
        // Modern Living Apartments
        hostel: "668f69768d90c30186fd54ef",
        roomNumber: 'ML-2B',
        roomType: 'double',
        roomGender: 'female',
        roomPrice: 900000,
        bookingPrice: 45000,
        roomDescription: 'Modern double apartment with a kitchenette and private bathroom.',
        maxOccupancy: 2,
    },
    {
        // Student Paradise
        hostel: "668f69768d90c30186fd54f5",
        roomNumber: 'SP-G03',
        roomType: 'shared',
        roomGender: 'male',
        roomPrice: 450000,
        bookingPrice: 20000,
        roomDescription: 'Basic and clean shared room, perfect for students on a tight budget.',
        maxOccupancy: 3,
    }
]

const seedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB and ready to seed rooms...")

        // Clear existing rooms
         await Room.deleteMany({});
         console.log("Cleared existing rooms");

        const insertRooms = await Room.insertMany(sampleRooms);
        console.log(`Successfully inserted ${insertRooms.length} rooms`);

        insertRooms.forEach(room => {
            console.log(`- Room ${room.roomNumber} (UGX ${room.roomPrice.toLocaleString()}) for hostel ${room.hostel}`);
        })
    } catch (error) {
        console.log(`Error inserting rooms: ${error}`);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
}

seedRooms()