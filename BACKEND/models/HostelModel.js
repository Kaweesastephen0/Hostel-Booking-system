import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hostel name is required'],
        trim: true,
        maxLength: [100, 'Hostel name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxLength: [1000, 'Description cannot exceed 1000 characters'],
        trim: true
    },
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
    amenities: {
        type: [String],
        validate: {
            validator: function(array) {
                return array.length <= 20;
            },
            message: 'Cannot have more than 20 amenities'
        }
    },
    HostelGender: {
        type: String,
        enum: ['male', 'female', 'mixed'],
        required: [true, 'Hostel gender is required']
    },
    distance: {
        type: String,
        required: [true, 'Distance from campus is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location area is required'],
        trim: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }]
}, {
    timestamps: true
});

// Add indexes for better performance
hostelSchema.index({ location: 1 });
hostelSchema.index({ featured: 1 });
hostelSchema.index({ HostelGender: 1 });

// Virtual to get primary image
hostelSchema.virtual('primaryImage').get(function() {
    const primaryImg = this.images?.find(img => img.isPrimary);
    return primaryImg?.url || this.images?.[0]?.url || '';
});

// Ensure virtuals are included in JSON
hostelSchema.set('toJSON', { virtuals: true });
hostelSchema.set('toObject', { virtuals: true });

export default mongoose.model("Hostel", hostelSchema);