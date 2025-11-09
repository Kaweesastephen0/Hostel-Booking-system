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

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Admins have universal access, bypass role check
    if (req.user && req.user.role === 'admin') {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Grant access to resource owners (for managers)
const checkOwnership = (model) => async (req, res, next) => {
  // Admins have universal access
  if (req.user.role === 'admin') {
    return next();
  }

  // Managers must own the resource
  if (req.user.role === 'manager') {
    const resource = await model.findById(req.params.id);

    if (!resource) {
      return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // Check if the resource has a 'manager' field and if it matches the user's ID
    if (resource.manager && resource.manager.toString() === req.user.id) {
      return next();
    } else {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to modify this resource`, 403));
    }
  }

  // Fallback for other roles (if any)
  return next(new ErrorResponse('You are not authorized to perform this action', 403));
};

// Middleware to apply manager filter for non-admin users
const applyManagerFilter = (req, res, next) => {
  // Admins can see everything - no filter needed
  if (req.user.role === 'admin') {
    req.managerFilter = null;
    return next();
  }

  // Managers can only see their own data
  if (req.user.role === 'manager') {
    req.managerFilter = { manager: req.user._id };
    return next();
  }

  return next(new ErrorResponse('Invalid user role', 403));
};

// Prevent managers from deleting resources (only admins can delete)
const protectDelete = (req, res, next) => {
  // Only admins can delete
  if (req.user.role === 'admin') {
    return next();
  }

  // Managers cannot delete
  if (req.user.role === 'manager') {
    return next(new ErrorResponse(
      'Managers cannot delete resources. Please contact the administrator for deletion requests.',
      403
    ));
  }

  return next(new ErrorResponse('You are not authorized to perform this action', 403));
};

export { protect, authorize, checkOwnership, applyManagerFilter, protectDelete };