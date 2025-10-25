import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'manager'],
        default: 'manager'
    },
    fullName: {
        type: String,
        required: [true, 'Please provide your full name']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

const User = mongoose.model('User', userSchema);

export default User;
