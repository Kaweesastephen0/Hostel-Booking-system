import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['single', 'double', 'shared', 'suite']
  },
  roomGender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'mixed']
  },
  roomPrice: {
    type: Number,
    required: true,
    min: 0
  },
  bookingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  roomDescription: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ roomType: 1 });
roomSchema.index({ roomPrice: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
