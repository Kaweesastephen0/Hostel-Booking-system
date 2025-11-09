import ActivityLog from '../models/ActivityLog.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

const CATEGORY_ACTION_MAP = {
    booking: '/bookings',
    payment: '/payments',
    user: '/users',
    hostel: '/hostels',
    room: '/rooms',
    settings: '/settings',
    system: '/settings'
};

const CATEGORY_TYPE_MAP = {
    booking: 'booking',
    payment: 'payment',
    user: 'user',
    hostel: 'hostel',
    room: 'room',
    settings: 'settings',
    system: 'warning'
};

const ROLE_CATEGORY_ACCESS = {
    admin: Object.keys(CATEGORY_ACTION_MAP),
    manager: ['booking', 'hostel', 'room', 'settings', 'system']
};

const buildType = (category, status) => {
    if (status === 'warning' || status === 'failed') {
        return 'warning';
    }
    return CATEGORY_TYPE_MAP[category] || 'system';
};

const extractMessage = (details, fallback) => {
    if (!details) {
        return fallback;
    }
    if (typeof details === 'string') {
        return details;
    }
    if (details.message) {
        return String(details.message);
    }
    if (details.description) {
        return String(details.description);
    }
    const summaryKeys = ['reference', 'status', 'guestName', 'hostelName', 'roomNumber', 'email'];
    const parts = summaryKeys
        .map((key) => details[key])
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value));
    if (parts.length > 0) {
        return parts.join(' • ');
    }
    const values = Object.values(details).filter((value) => typeof value === 'string' || typeof value === 'number');
    if (values.length > 0) {
        return values.slice(0, 2).map((value) => String(value)).join(' • ');
    }
    return fallback;
};

const buildActionUrl = (category, details) => {
    if (category === 'booking' && details?.bookingId) {
        return `/bookings/${details.bookingId}`;
    }
    if (category === 'payment' && details?.paymentId) {
        return `/payments/${details.paymentId}`;
    }
    if (category === 'user' && details?.userId) {
        return `/users/${details.userId}`;
    }
    if (category === 'hostel' && details?.hostelId) {
        return `/hostels/${details.hostelId}`;
    }
    if (category === 'room' && details?.roomId) {
        return `/rooms/${details.roomId}`;
    }
    return CATEGORY_ACTION_MAP[category] || '/dashboard';
};

const getAccessibleCategories = (role) => {
    if (!role) {
        return ROLE_CATEGORY_ACCESS.manager;
    }
    return ROLE_CATEGORY_ACCESS[role] || ROLE_CATEGORY_ACCESS.manager;
};

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

export const getUserNotifications = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const role = req.user?.role || 'manager';
    const categories = getAccessibleCategories(role);
    const criteria = {
        category: { $in: categories },
        $or: [
            { user: req.user._id },
            { userType: role },
            { userType: 'system' }
        ]
    };

    const logs = await ActivityLog.find(criteria)
        .sort({ createdAt: -1 })
        .limit(limit);

    const notifications = logs.map((log) => {
        const details = log.details || {};
        const title = log.action;
        const message = extractMessage(details, log.action);
        return {
            id: String(log._id),
            title,
            message,
            type: buildType(log.category, log.status),
            timestamp: log.createdAt,
            read: false,
            actionUrl: buildActionUrl(log.category, details)
        };
    });

    res.status(200).json({
        success: true,
        data: notifications
    });
});