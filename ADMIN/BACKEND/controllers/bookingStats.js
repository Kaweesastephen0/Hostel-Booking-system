import Booking from '../models/Booking.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get monthly booking statistics
// @route   GET /api/bookings/stats/monthly
// @access  Private
export const getMonthlyStats = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: {
        '_id.year': -1,
        '_id.month': -1
      }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});