import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // System Fields
    paymentReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    reference: {
      type: String,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    // Guest Information
    guestName: {
      type: String,
      required: [true, 'Please provide the guest name'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
    },
    idNumber: {
      type: String,
      trim: true,
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    location: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },

    // Booking Information
    hostelName: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Please provide the room number'],
      trim: true,
    },
    roomType: {
      type: String,
      trim: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide a check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide a check-out date'],
    },
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 day'],
      required: [true, 'Please provide the duration of stay'],
    },
    nights: {
      type: Number,
      default: 1,
      min: [1, 'Must be at least 1 night'],
    },

    // Payment Information
    paymentMethod: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      min: [0, 'Amount must be greater than or equal to zero'],
      required: [true, 'Please provide the booking amount'],
    },
    paymentNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre('save', function (next) {
  if (this.checkIn && this.checkOut) {
    const diff = this.checkOut.getTime() - this.checkIn.getTime();
    if (diff <= 0) {
      return next(new Error('Check-out date must be after check-in date'));
    }
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    this.nights = Math.max(1, nights);
  }

  if (!this.reference) {
    this.reference = `BK-${Date.now().toString(36).toUpperCase()}`;
  }

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
