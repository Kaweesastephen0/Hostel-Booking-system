import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['booking', 'payment', 'user', 'hostel', 'room', 'settings', 'system'],
        required: true,
        index: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending', 'warning'],
        default: 'success',
        index: true
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    userType: {
        type: String,
        enum: ['admin', 'manager', 'frontUser', 'system'],
        required: true,
        index: true
    }
}, {
    timestamps: true, // Adds updatedAt field
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            // Format dates in ISO string for frontend
            ret.createdAt = ret.createdAt.toISOString();
            if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toISOString();
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Index for better query performance
ActivityLogSchema.index({ category: 1, createdAt: -1 });
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ userType: 1, createdAt: -1 });
ActivityLogSchema.index({ status: 1, createdAt: -1 });

// Virtual for formatted date (optional, can be handled by frontend)
ActivityLogSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleString();
});

// Pre-save middleware to ensure userType is set
ActivityLogSchema.pre('save', async function(next) {
    if (!this.userType) {
        // If userType isn't set, try to get it from the user reference
        if (this.user) {
            try {
                const User = mongoose.model('User');
                const user = await User.findById(this.user);
                if (user) {
                    this.userType = user.role;
                } else {
                    this.userType = 'system';
                }
            } catch (error) {
                this.userType = 'system';
            }
        } else {
            this.userType = 'system';
        }
    }
    next();
});

export default mongoose.model('ActivityLog', ActivityLogSchema);