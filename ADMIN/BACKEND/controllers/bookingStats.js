import Booking from '../models/Booking.js';
import asyncHandler from '../middleware/async.js';
import mongoose from 'mongoose';

// @desc    Get monthly booking statistics
// @route   GET /api/bookings/stats/monthly
// @access  Private
export const getMonthlyStats = asyncHandler(async (req, res) => {
  const pipeline = [];

  // Apply manager filter if the user is not an admin
  if (req.managerFilter && Object.keys(req.managerFilter).length > 0) {
    const { manager } = req.managerFilter;
    pipeline.push({
      $match: {
        manager: new mongoose.Types.ObjectId(manager)
      }
    });
  }

  pipeline.push(
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
  );

  const stats = await Booking.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: stats
  });
});