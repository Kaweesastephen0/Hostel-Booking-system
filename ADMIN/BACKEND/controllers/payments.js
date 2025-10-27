import Payment from '../Models/Payment.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../middleware/async.js';

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const formatPaymentResponse = (payment) => {
  if (!payment) return null;
  const source = typeof payment.toObject === 'function' ? payment.toObject() : payment;

  const bookingSource = typeof source.booking === 'object' && source.booking !== null
    ? source.booking
    : null;

  return {
    id: source._id || source.id,
    reference: source.reference,
    booking: bookingSource
      ? {
        id: bookingSource._id || bookingSource.id,
        reference: bookingSource.reference,
        guestName: bookingSource.guestName,
        roomNumber: bookingSource.roomNumber,
      }
      : source.booking ?? null,
    method: source.method,
    status: source.status,
    amount: source.amount,
    notes: source.notes,
    paidAt: source.paidAt,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};

export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, method = 'cash', status = 'pending', notes } = req.body;

  if (!bookingId || typeof amount !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Booking ID and amount are required.',
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Related booking not found.',
    });
  }

  const payment = await Payment.create({
    booking: bookingId,
    amount,
    method,
    status,
    notes,
    paidAt: status === 'completed' ? new Date() : undefined,
  });

  res.status(201).json({
    success: true,
    data: {
      payment: formatPaymentResponse(await payment.populate('booking')),
    },
  });
});

export const getPayments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    search = '',
    status,
    method,
    bookingId,
  } = req.query;

  const pageNumber = parsePositiveInt(page, 1);
  const limitNumber = parsePositiveInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const sortDirection = order === 'asc' ? 1 : -1;
  const sortField = typeof sort === 'string' && sort.trim() ? sort : 'createdAt';

  const query = {};

  if (bookingId) {
    query.booking = bookingId;
  }

  if (search && typeof search === 'string') {
    query.$or = [
      { reference: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (method && method !== 'all') {
    query.method = method;
  }

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNumber)
      .populate('booking', 'reference guestName roomNumber')
      .lean(),
    Payment.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      payments: payments.map(formatPaymentResponse),
      total,
      page: pageNumber,
      limit: limitNumber,
    },
  });
});

export const getPaymentsForBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'Booking ID is required.' });
  }

  const payments = await Payment.find({ booking: bookingId })
    .sort({ createdAt: -1 })
    .populate('booking', 'reference guestName roomNumber')
    .lean();

  const formatted = payments.map(formatPaymentResponse);

  const totals = formatted.reduce(
    (acc, payment) => {
      const amount = typeof payment.amount === 'number' ? payment.amount : 0;

      acc.total += amount;

      switch (payment.status) {
        case 'completed':
          acc.completed += amount;
          break;
        case 'pending':
          acc.pending += amount;
          break;
        case 'failed':
          acc.failed += amount;
          break;
        case 'refunded':
          acc.refunded += amount;
          break;
        default:
          break;
      }

      return acc;
    },
    { total: 0, completed: 0, pending: 0, failed: 0, refunded: 0 }
  );

  res.status(200).json({
    success: true,
    data: {
      payments: formatted,
      totals,
    },
  });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findById(id).populate('booking', 'reference guestName roomNumber').lean();

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  res.status(200).json({
    success: true,
    data: { payment: formatPaymentResponse(payment) },
  });
});

export const updatePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { method, status, amount, notes } = req.body;

  const payment = await Payment.findById(id);

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  if (method !== undefined) payment.method = method;
  if (status !== undefined) {
    payment.status = status;
    if (status === 'completed' && !payment.paidAt) {
      payment.paidAt = new Date();
    }
  }
  if (amount !== undefined) payment.amount = amount;
  if (notes !== undefined) payment.notes = notes;

  const updatedPayment = await payment.save();

  res.status(200).json({
    success: true,
    data: {
      payment: formatPaymentResponse(await updatedPayment.populate('booking', 'reference guestName roomNumber')),
    },
  });
});

export const deletePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findById(id);

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  await payment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Payment deleted successfully',
  });
});

export default {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsForBooking,
};
