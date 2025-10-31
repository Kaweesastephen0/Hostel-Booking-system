// Room Model
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'Room name is required'],
        trim: true,
        maxLength: [100, 'Room cannot exceed 100 characters']
    },
    roomType: {
        type: String,
        enum: ['shared', 'single', 'double'],
        required: [true, 'Room type is required']
    },
    roomGender: {
        type: String,
        enum: ['male', 'female', 'mixed'],
        required: [true, 'Room gender is required']
    },
    roomPrice: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    hostelId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hostel', 
        required: [true, 'Hostel Id is required']
    },
    bookingPrice: {
        type: Number,
        required: [true, 'Booking price is needed'],
        min: [0, 'Booking price cannot be negative']
    },
    roomDescription: {
        type: String,
        required: [true, 'Room description is required'],
        maxLength: [200, 'Description cannot exceed 200 characters']
    },
    maxOccupancy: {
        type: Number,
        required: [true, 'Maximum number of people per room is highly needed'],
        min: [1, 'Max occupancy must be at least 1']
    },
    roomImages: [{
        url: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
}, {
    timestamps: true
});

// Add indexes for faster retrieval
roomSchema.index({ hostelId: 1 });
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ roomType: 1 });
roomSchema.index({ roomGender: 1 });
roomSchema.index({ createdAt: -1 });
roomSchema.index({ hostelId: 1, roomType: 1 });
roomSchema.index({ isShownFirst: -1 });

// Virtual to get primary room image
roomSchema.virtual('primaryRoomImage').get(function() {
    const primaryImg = this.roomImages?.find(img => img.isPrimary);
    return primaryImg?.url || this.roomImages?.[0]?.url || '';
});

// Virtual to get all room images sorted (primary first)
roomSchema.virtual('sortedRoomImages').get(function() {
    if (!this.roomImages || this.roomImages.length === 0) return [];
    
    const primary = this.roomImages.filter(img => img.isPrimary);
    const others = this.roomImages.filter(img => !img.isPrimary);
    
    return [...primary, ...others];
});

// Ensure virtuals are included in JSON
roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

export default mongoose.model('Room', roomSchema);