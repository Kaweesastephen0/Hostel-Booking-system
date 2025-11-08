// Room Model
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'Room name is required'],
        trim: true,
        maxLength: [100, 'Room name cannot exceed 100 characters']
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
        required: [true, 'Booking price is required'],
        min: [0, 'Booking price cannot be negative']
    },
    roomDescription: {
        type: String,
        required: [true, 'Room description is required'],
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    maxOccupancy: {
        type: Number,
        required: [true, 'Maximum occupancy is required'],
        min: [1, 'Max occupancy must be at least 1']
    },
    // ✅ Use same image schema as Hostel model
    images: [{
        url: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    availability: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// ✅ Indexes for faster lookups
roomSchema.index({ hostelId: 1 });
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ roomType: 1 });
roomSchema.index({ roomGender: 1 });
roomSchema.index({ createdAt: -1 });
roomSchema.index({ hostelId: 1, roomType: 1 });
roomSchema.index({ featured: 1 });

// ✅ Virtual: Primary image (same logic as hostelModel)
roomSchema.virtual('primaryImage').get(function() {
    const primaryImg = this.images?.find(img => img.isPrimary);
    return primaryImg?.url || this.images?.[0]?.url || '';
});

// ✅ Virtual: All images sorted (primary first)
roomSchema.virtual('sortedImages').get(function() {
    if (!this.images || this.images.length === 0) return [];
    
    const primary = this.images.filter(img => img.isPrimary);
    const others = this.images.filter(img => !img.isPrimary);
    
    return [...primary, ...others];
});

// ✅ Virtual: Link back to parent hostel
roomSchema.virtual('hostel', {
    ref: 'Hostel',
    localField: 'hostelId',
    foreignField: '_id',
    justOne: true
});

// ✅ Ensure virtuals are included in JSON and Object outputs
roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

export default mongoose.model('Room', roomSchema);
