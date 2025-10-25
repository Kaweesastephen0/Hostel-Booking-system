import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: [true, "Your full name is required"], 
      trim: true 
    },
    gender: { 
      type: String, 
      required: [true, "Gender is required"], 
      trim: true 
    },
    age: { 
      type: Number, 
      required: [true, "Your age is required"],
      min: 0 
    },
    occupation: { 
      type: String, 
      default: '', 
      trim: true 
    },
    idNumber: { 
      type: String, 
      required: [true, "Your ID/ STN is required"],
      trim: true 
    },
    phone: { 
      type: String, 
      required: [true, "Phone is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      lowercase: true, 
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
      trim: true 
    },
    location: { 
      type: String, 
      required: [true, "Location is required"],
      trim: true 
    },

    hostelName: { 
      type: String, 
      required:  [true, "Hostel name is required"],
      trim: true 
    },
    roomNumber: { 
      type: String, 
      required:  [true, "Room number is required"],
      trim: true 
    },
    roomType: { 
      type: String, 
      required: [true, "Room type is required"], 
      trim: true 
    },
    duration: { 
      type: String, 
      required: [true, "Period is required"],
      trim: true 
    },
    checkIn: { 
      type: Date, 
      required: [true, "Checkin is required"],
    },

    paymentMethod: { 
      type: String, 
      required: [true, "Payment method is required"], 
      trim: true 
    },
    bookingFee: { 
      type: Number, 
      required: [true, "Booking fee is required"],
      min: 0 
    },
    paymentNumber: { 
      type: String, 
      required:  [true, "Payment number is required"],
      trim: true 
    },

    status: { 
      type: String, enum: ['pending', 'confirmed', 'cancelled'], 
      default: 'pending' },
  },
  { timestamps: true }
);

 
export default mongoose.model('Booking', BookingSchema);
