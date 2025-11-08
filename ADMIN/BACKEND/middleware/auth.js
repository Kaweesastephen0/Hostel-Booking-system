import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

// Protected routes
const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error(
        "Error: JWT_SECRET is not defined in environment variables"
      );
      return next(new ErrorResponse("Server configuration error", 500));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    // Check if user account is active
    if (!user.isActive) {
      return next(new ErrorResponse("User account is deactivated", 401));
    }

    // Add user to request object
    req.user = user;
    
    // Add filter for manager-specific data access
    if (user.role === 'manager') {
      req.managerFilter = { manager: user._id };
    } else {
      req.managerFilter = {}; // Admin can see all
    }
    
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    
    // For manager role, ensure they can only access their own data
    if (req.user.role === 'manager' && req.params.managerId && req.params.managerId !== req.user._id.toString()) {
      return next(
        new ErrorResponse(
          'Not authorized to access this resource',
          403
        )
      );
    }
    
    next();
  };
};

// Middleware to check if user is the owner of the resource
const checkOwnership = (model, fieldName = 'manager') => {
  return async (req, res, next) => {
    try {
      // Skip for admin users
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return next(
          new ErrorResponse('Resource not found', 404)
        );
      }
      
      // Check if the user is the owner of the resource
      if (resource[fieldName].toString() !== req.user._id.toString()) {
        return next(
          new ErrorResponse('Not authorized to access this resource', 403)
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { protect, authorize, checkOwnership };
