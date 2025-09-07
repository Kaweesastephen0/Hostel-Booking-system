import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  amenities: [{
    type: String
  }],
  roomTypes: [{
    type: {
      type: String,
      enum: ['single', 'double', 'dormitory', 'suite'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      default: 0
    }
  }],
  images: [{
    url: String,
    alt: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    petPolicy: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
hostelSchema.index({ 'location.city': 1, 'location.state': 1 });
hostelSchema.index({ name: 'text', description: 'text' });

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
