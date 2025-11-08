import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    // Common fields (can be overridden by hostel-specific settings)
    siteName: {
        type: String,
        default: 'Hostel Booking System'
    },
    address: {
        type: String,
        default: 'N/A'
    },
    contactEmail: {
        type: String,
        default: 'contact@example.com'
    },
    contactPhone: {
        type: String,
        default: '+1234567890'
    },
    checkInTime: {
        type: String,
        default: '14:00'
    },
    checkOutTime: {
        type: String,
        default: '11:00'
    },
    currency: {
        type: String,
        default: 'UGX'
    },
    timeZone: {
        type: String,
        default: 'EAT'
    },
    logoUrl: {
        type: String,
        default: ''
    },

    // System Admin specific fields
    systemName: {
        type: String,
        default: 'Hostel Booking System'
    },
    systemLogoUrl: {
        type: String,
        default: ''
    },
    systemDomain: {
        type: String,
        default: 'localhost:3000'
    },
    numberOfHostels: {
        type: Number,
        default: 0
    },
    defaultCountry: {
        type: String,
        default: 'Uganda'
    },
    globalCheckInTime: {
        type: String,
        default: '14:00'
    },
    globalCheckOutTime: {
        type: String,
        default: '11:00'
    },
    autoApprovalRules: {
        type: String,
        default: 'None'
    },
    paymentFlutterwaveKey: {
        type: String,
        default: ''
    },
    paymentPayPalKey: {
        type: String,
        default: ''
    },
    userPermissions: {
        type: String,
        default: 'Standard'
    },
    passwordPolicies: {
        type: String,
        default: 'Strong'
    },
    dataBackup: {
        type: String,
        default: 'Daily'
    },
    softwareVersion: {
        type: String,
        default: '1.0.0'
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    adminTheme: {
        type: String,
        default: 'Default'
    },
    faviconUrl: {
        type: String,
        default: ''
    },
    emailTemplates: {
        type: String,
        default: 'Default'
    },

    // Hostel Manager specific fields
    hostelDescription: {
        type: String,
        default: 'A great place to stay.'
    },
    bookingWindow: {
        type: String,
        default: '365 days'
    },
    depositRequirements: {
        type: String,
        default: 'None'
    },
    defaultRates: {
        type: String,
        default: ''
    },
    taxes: {
        type: String,
        default: '0%'
    },
    discounts: {
        type: String,
        default: 'None'
    },
    cancellationPolicy: {
        type: String,
        default: '24 hours prior'
    },
    refundPolicy: {
        type: String,
        default: 'No refunds'
    },
    guestBehaviorPolicy: {
        type: String,
        default: 'Respectful'
    },
    emailSmsPreferences: {
        type: String,
        default: 'All notifications'
    },
    autoReminders: {
        type: String,
        default: '24 hours before check-in'
    },
    staffManagement: {
        type: String,
        default: 'Internal'
    },
    enableListing: {
        type: Boolean,
        default: true
    },
    hostelMaintenanceMode: {
        type: Boolean,
        default: false
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // optional owner for property-level settings (hostel managers)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // optional hostel reference (future-proofing)
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Settings', SettingsSchema);