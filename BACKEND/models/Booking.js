import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    gender: { 
      type: String, 
      required: true, 
      trim: true 
    },
    age: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    occupation: { 
      type: String, 
      default: '', 
      trim: true 
    },
    idNumber: { 
      type: String, 
      required: false, 
      trim: true 
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true 
    },
    location: { 
      type: String, 
      default: '', 
      trim: true 
    },

    hostelName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    roomNumber: { 
      type: String, 
      required: true, 
      trim: true 
    },
    roomType: { 
      type: String, 
      required: true, 
      trim: true 
    },
    duration: { 
      type: String, 
      required: true, 
      trim: true 
    },
    checkIn: { 
      type: Date, 
      required: true 
    },

    paymentMethod: { 
      type: String, 
      required: true, 
      trim: true 
    },
    bookingFee: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    paymentNumber: { 
      type: String, 
      default: '', 
      trim: true 
    },

    status: { 
      
      type: String, enum: ['pending', 'confirmed', 'cancelled'], 
      default: 'pending' },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
