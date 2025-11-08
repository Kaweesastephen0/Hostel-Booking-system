import Settings from '../models/Settings.js';
import ActivityLog from '../models/ActivityLog.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import mongoose from 'mongoose';

// @desc    Get all settings
// @route   GET /api/v1/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req, res, next) => {
    let settings;
    let globalSettings = await Settings.findOne({ owner: { $exists: false } });

    if (!globalSettings) {
        // Create a default global settings document if it doesn't exist
        globalSettings = await Settings.create({});
    }

    if (req.user && req.user.role === 'manager') {
        settings = await Settings.findOne({ owner: req.user.id });
        if (!settings) {
            // If manager-specific settings don't exist, create them based on global defaults
            settings = await Settings.create({
                ...globalSettings.toObject(), // Copy global settings
                _id: new mongoose.Types.ObjectId(), // Generate new ID
                owner: req.user.id,
                updatedBy: req.user.id,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }
    } else {
        // admin or other roles get the global settings
        settings = globalSettings;
    }

    res.status(200).json({
        success: true,
        data: settings || {}
    });
});

// @desc    Update settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res, next) => {
    const managerAllowedFields = [
        'siteName',
        'address',
        'contactEmail',
        'contactPhone',
        'checkInTime',
        'checkOutTime',
        'currency',
        'timeZone',
        'logoUrl',
        'hostelDescription',
        'bookingWindow',
        'depositRequirements',
        'defaultRates',
        'taxes',
        'discounts',
        'cancellationPolicy',
        'refundPolicy',
        'guestBehaviorPolicy',
        'emailSmsPreferences',
        'autoReminders',
        'staffManagement',
        'enableListing',
        'hostelMaintenanceMode',
    ];

    let settings;

    if (req.user && req.user.role === 'manager') {
        const payload = {};
        Object.keys(req.body || {}).forEach(key => {
            if (managerAllowedFields.includes(key)) payload[key] = req.body[key];
        });

        settings = await Settings.findOneAndUpdate(
            { owner: req.user.id },
            {
                ...payload,
                updatedBy: req.user.id,
                updatedAt: Date.now()
            },
            {
                new: true,
                upsert: true, // Create if not found
                runValidators: true
            }
        );

        await ActivityLog.create({
            user: req.user.id,
            action: 'Updated property settings',
            category: 'settings',
            details: { changes: payload },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    } else {
        // Admin: update global settings (owner not set)
        settings = await Settings.findOneAndUpdate(
            { owner: { $exists: false } },
            {
                ...req.body,
                updatedBy: req.user.id,
                updatedAt: Date.now()
            },
            {
                new: true,
                upsert: true, // Create if not found
                runValidators: true
            }
        );

        await ActivityLog.create({
            user: req.user.id,
            action: 'Updated system settings',
            category: 'settings',
            details: { changes: req.body },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    }

    res.status(200).json({
        success: true,
        data: settings
    });
});

// @desc    Get maintenance mode status
// @route   GET /api/v1/settings/maintenance
// @access  Public
export const getMaintenanceStatus = asyncHandler(async (req, res, next) => {
    const settings = await Settings.findOne().select('maintenanceMode');
    res.status(200).json({
        success: true,
        data: settings ? settings.maintenanceMode : false
    });
});

// @desc    Toggle maintenance mode
// @route   PUT /api/v1/settings/maintenance
// @access  Private/Admin
export const toggleMaintenanceMode = asyncHandler(async (req, res, next) => {
    const settings = await Settings.findOne();
    
    if (!settings) {
        return next(new ErrorResponse('Settings not found', 404));
    }

    settings.maintenanceMode = !settings.maintenanceMode;
    settings.updatedBy = req.user.id;
    settings.updatedAt = Date.now();
    
    await settings.save();

    // Log the activity
    await ActivityLog.create({
        user: req.user.id,
        action: `${settings.maintenanceMode ? 'Enabled' : 'Disabled'} maintenance mode`,
        category: 'system',
        details: {
            maintenanceMode: settings.maintenanceMode
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    });

    res.status(200).json({
        success: true,
        data: settings
    });
});