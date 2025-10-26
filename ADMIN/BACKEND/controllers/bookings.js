import Booking from '../models/Booking.js';
import asyncHandler from '../middleware/async.js';

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
    guestName,
    guestEmail,
    guestPhone,
    roomNumber,
    status = 'pending',
    checkIn,
    checkOut,
    amount,
    notes,
  } = req.body;

  if (!guestName || !roomNumber || !checkIn || !checkOut || typeof amount !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Guest name, room number, check-in, check-out, and amount are required.',
    });
  }

  const booking = await Booking.create({
    guestName,
    guestEmail,
    guestPhone,
    roomNumber,
    status,
    checkIn,
    checkOut,
    amount,
    notes,
  });

  res.status(201).json({
    success: true,
    data: {
      booking: formatBookingResponse(booking),
    },
  });
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

  await booking.deleteOne();

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
