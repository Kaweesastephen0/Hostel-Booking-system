import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import asyncHandler from '../middleware/async.js';
import { createActivityLog } from '../utils/activityLogger.js';

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const formatBookingResponse = (booking) => {
  if (!booking) return null;
  const source = typeof booking.toObject === 'function' ? booking.toObject() : booking;

  return {
    id: source._id || source.id,
    reference: source.reference,
    guestName: source.guestName,
    guestEmail: source.guestEmail,
    guestPhone: source.guestPhone,
    roomNumber: source.roomNumber,
    status: source.status,
    checkIn: source.checkIn,
    checkOut: source.checkOut,
    nights: source.nights,
    amount: source.amount,
    notes: source.notes,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};

export const createBooking = asyncHandler(async (req, res) => {
  const {
    fullName,
    roomNumber,
    checkIn,
    duration,
    bookingFee,
    // Optional fields with defaults
    gender = '',
    age = '',
    idNumber = '',
    phone = '',
    email = '',
    location = '',
    hostelName = '',
    roomType = '',
    paymentMethod = '',
    paymentNumber = '',
    status = 'pending'
  } = req.body;

  // Validate required fields
  if (!fullName || !roomNumber || !checkIn || !duration || !bookingFee) {
    return res.status(400).json({
      success: false,
      message: 'Guest name, room number, check-in, duration, and booking fee are required.',
    });
  }

  // Convert booking fee to number
  const bookingFeeValue = parseFloat(bookingFee);
  if (isNaN(bookingFeeValue) || bookingFeeValue <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Booking fee must be a valid positive number.',
    });
  }

  // Parse and validate duration
  const durationDays = parseInt(duration, 10);
  if (isNaN(durationDays) || durationDays < 1) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid duration (at least 1 day)',
    });
  }

  // Calculate check-out date based on duration
  const checkInDate = new Date(checkIn);
  if (isNaN(checkInDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid check-in date',
    });
  }

  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + durationDays);

  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // Create the booking
    const booking = await Booking.create([{
      // Guest Information
      guestName: fullName,
      guestEmail: email,
      guestPhone: phone,
      gender,
      age: parseInt(age) || 0,
      idNumber,
      location,
      
      // Booking Information
      roomNumber,
      roomType,
      hostelName,
      status,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      duration: durationDays,
      nights: durationDays,
      
      // Payment Information
      amount: bookingFeeValue,
      paymentMethod,
      paymentNumber,
      
      // System Fields
      reference: `BKG-${Date.now()}`,
    }], { session });

    // Create the payment record
    const Payment = mongoose.model('Payment');
    const payment = await Payment.create([{
      booking: booking[0]._id,
      method: paymentMethod || 'cash',
      status: 'completed',
      amount: bookingFeeValue,
      notes: `Payment for booking ${booking[0].reference}`,
      paidAt: new Date()
    }], { session });

    // Update booking with payment reference
    booking[0].paymentReference = payment[0]._id;
    await booking[0].save({ session });

    // Commit the transaction
    await session.commitTransaction();
    
    // Get the populated booking after transaction is committed
    const populatedBooking = await Booking.findById(booking[0]._id).populate('paymentReference');
    
    // End the session
    session.endSession();
    
    await createActivityLog(
      req,
      `Created booking: ${booking[0].reference}`,
      'booking',
      {
        bookingId: booking[0]._id,
        reference: booking[0].reference,
        guestName: booking[0].guestName,
        guestEmail: booking[0].guestEmail,
        roomNumber: booking[0].roomNumber,
        checkIn: booking[0].checkIn,
        checkOut: booking[0].checkOut,
        amount: booking[0].amount,
        status: booking[0].status
      }
    );
    
    // Send response
    res.status(201).json({
      success: true,
      data: {
        booking: formatBookingResponse(populatedBooking),
        payment: {
          id: payment[0]._id,
          reference: payment[0].reference,
          status: payment[0].status,
          amount: payment[0].amount,
          method: payment[0].method,
          paidAt: payment[0].paidAt
        }
      },
    });
    
  } catch (error) {
    // If anything fails, rollback the transaction if it was started
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    
    // Always end the session
    if (session.inTransaction()) {
      session.endSession();
    }
    
    console.error('Error creating booking:', error);
    throw error;
  }
});

export const getBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'checkIn',
    order = 'desc',
    search = '',
    status,
    dateRange,
  } = req.query;

  const pageNumber = parsePositiveInt(page, 1);
  const limitNumber = parsePositiveInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const sortDirection = order === 'asc' ? 1 : -1;
  const sortField = typeof sort === 'string' && sort.trim() ? sort : 'checkIn';

  const query = {};

  if (search && typeof search === 'string') {
    query.$or = [
      { guestName: { $regex: search, $options: 'i' } },
      { guestEmail: { $regex: search, $options: 'i' } },
      { reference: { $regex: search, $options: 'i' } },
      { roomNumber: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    let startDate;
    let endDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'thisWeek':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'upcoming':
        startDate = now;
        break;
      default:
        break;
    }

    if (startDate) {
      query.checkIn = { $gte: startDate };
    }
    if (endDate) {
      query.checkOut = { ...(query.checkOut || {}), $lte: endDate };
    }
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Booking.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      bookings: bookings.map(formatBookingResponse),
      total,
      page: pageNumber,
      limit: limitNumber,
    },
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).lean();

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  res.status(200).json({
    success: true,
    data: { booking: formatBookingResponse(booking) },
  });
});

export const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    guestName,
    guestEmail,
    guestPhone,
    roomNumber,
    status,
    checkIn,
    checkOut,
    amount,
    notes,
  } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const oldData = {
    guestName: booking.guestName,
    status: booking.status,
    amount: booking.amount,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut
  };

  if (guestName !== undefined) booking.guestName = guestName;
  if (guestEmail !== undefined) booking.guestEmail = guestEmail;
  if (guestPhone !== undefined) booking.guestPhone = guestPhone;
  if (roomNumber !== undefined) booking.roomNumber = roomNumber;
  if (status !== undefined) booking.status = status;
  if (checkIn !== undefined) booking.checkIn = checkIn;
  if (checkOut !== undefined) booking.checkOut = checkOut;
  if (amount !== undefined) booking.amount = amount;
  if (notes !== undefined) booking.notes = notes;

  const updatedBooking = await booking.save();

  await createActivityLog(
    req,
    `Updated booking: ${updatedBooking.reference}`,
    'booking',
    {
      bookingId: updatedBooking._id,
      reference: updatedBooking.reference,
      oldData,
      newData: {
        guestName: updatedBooking.guestName,
        status: updatedBooking.status,
        amount: updatedBooking.amount,
        checkIn: updatedBooking.checkIn,
        checkOut: updatedBooking.checkOut
      },
      changes: req.body
    }
  );

  res.status(200).json({
    success: true,
    data: {
      booking: formatBookingResponse(updatedBooking),
    },
  });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const bookingData = {
    bookingId: booking._id,
    reference: booking.reference,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    roomNumber: booking.roomNumber,
    status: booking.status,
    amount: booking.amount
  };

  await booking.deleteOne();

  await createActivityLog(
    req,
    `Deleted booking: ${booking.reference}`,
    'booking',
    bookingData
  );

  res.status(200).json({
    success: true,
    message: 'Booking deleted successfully',
  });
});

export default {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
