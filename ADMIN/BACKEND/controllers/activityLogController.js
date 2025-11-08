import ActivityLog from '../models/ActivityLog.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get all activity logs
// @route   GET /api/v1/logs
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const query = {};

    // Filter by category if provided
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Filter by userType if provided
    if (req.query.userType) {
        query.userType = req.query.userType;
    }

    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    // Filter by user if provided
    if (req.query.userId) {
        query.user = req.query.userId;
    }

    // Search in action and details if search term provided
    if (req.query.search) {
        query.$or = [
            { action: { $regex: req.query.search, $options: 'i' } },
            { details: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const total = await ActivityLog.countDocuments(query);

    const logs = await ActivityLog.find(query)
        .populate({
            path: 'user',
            select: 'name email role'
        })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: logs.length,
        pagination,
        data: logs
    });
});

// @desc    Get activity logs by category
// @route   GET /api/v1/logs/:category
// @access  Private/Admin
export const getLogsByCategory = asyncHandler(async (req, res, next) => {
    const logs = await ActivityLog.find({ category: req.params.category })
        .populate({
            path: 'user',
            select: 'name email role'
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });
});

// @desc    Create a new activity log
// @route   POST /api/v1/logs
// @access  Private/Admin
export const createActivityLog = asyncHandler(async (req, res, next) => {
    const { action, category, details } = req.body;

    const log = await ActivityLog.create({
        user: req.user.id,
        action,
        category,
        details,
        userType: req.user.role || 'admin',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(201).json({
        success: true,
        data: log
    });
});

// @desc    Clear old activity logs
// @route   DELETE /api/v1/logs
// @access  Private/Admin
export const clearOldLogs = asyncHandler(async (req, res, next) => {
    const daysToKeep = req.query.days || 30;
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysToKeep);

    const result = await ActivityLog.deleteMany({
        createdAt: { $lt: dateThreshold }
    });

    // Log the cleanup activity
    await ActivityLog.create({
        user: req.user.id,
        action: 'Cleared old activity logs',
        category: 'system',
        details: {
            deletedCount: result.deletedCount,
            daysKept: daysToKeep
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(200).json({
        success: true,
        data: {
            deletedCount: result.deletedCount
        }
    });
});