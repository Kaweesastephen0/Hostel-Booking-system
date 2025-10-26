import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      trim: true,
    },
    guestName: {
      type: String,
      required: [true, 'Please provide the guest name'],
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
    guestPhone: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Please provide the room number'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide a check-in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide a check-out date'],
    },
    nights: {
      type: Number,
      default: 1,
      min: 1,
    },
    amount: {
      type: Number,
      min: [0, 'Amount must be greater than or equal to zero'],
      required: [true, 'Please provide the booking amount'],
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
