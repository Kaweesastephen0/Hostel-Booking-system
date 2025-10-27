import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

// Protected routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Debug log to check JWT secret
        console.log('JWT Secret:', process.env.JWT_SECRET ? 'Secret is set' : 'Secret is NOT set');
        
        if (!process.env.JWT_SECRET) {
            console.error('Error: JWT_SECRET is not defined in environment variables');
            return next(new ErrorResponse('Server configuration error', 500));
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return next(new ErrorResponse('No user found with this id', 404));
        }

        // Check if user account is active
        if (!user.isActive) {
            return next(new ErrorResponse('User account is deactivated', 401));
        }

        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
            );
        }
        next();
    };
};

export { protect, authorize };
