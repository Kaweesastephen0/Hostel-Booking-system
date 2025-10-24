// room Model
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type: String,
        required:[true, 'Room name is required'],
        trim: true,
        maxLength:[100, 'Room cannot exceed 100 characters']
        
    },
    roomImage:{
        type: String,
        required:[true, 'Room picture is required']

    },
    roomType:{
        type: String,
        enum:['shared', 'single', 'double'],
        required:[true, 'Room type is required']
    },
    roomGender:{
        type: String,
        enum: ['male', 'female', 'mixed'],
        required: [true, 'Room type is required']
    },
    roomPrice:{
        type: Number,
        required: [true, 'price is required'],
        min:[0, 'price cannot be negative']


    },
    hostelId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hostel', 
        required: [true, 'Hostel Id is required']
    },

    bookingPrice:{
        type : Number,
        required: [true, 'Booking price is needed'],
        min:[0, 'booking price cannot be negative']
    },
    roomDescription:{
        type: String,
        required: [true, 'Room description is required'],
        maxLength:[200, 'Description cannot exceed 200 characters']
    },
    maxOccupancy:{
        type: Number,
        required: [true, 'Maximum number of people per room is highly needed'],
    }

},{
    timestamps: true,
})
// Add indexes for faster retrieval
roomSchema.index({ hostelId: 1 }); // Index for queries filtering by hostelId
roomSchema.index({ roomNumber: 1 }); // Index for queries by roomNumber
roomSchema.index({ roomType: 1 }); // Index for queries by roomType
roomSchema.index({ roomGender: 1 }); // Index for queries by roomGender
roomSchema.index({ createdAt: -1 }); // Index for sorting by creation date (descending)
roomSchema.index({ hostelId: 1, roomType: 1 }); // Compound index for hostelId + roomType queries

export default mongoose.model('Room', roomSchema);