import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import jwt from "jsonwebtoken";
import { logActivity } from "../utils/activityLogger.js";


export const register = asyncHandler(async (req, res, next) => {
  const { email, password, fullName, role } = req.body;

  // Checking if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  // Creating user
  const user = await User.create({
    email,
    password,
    fullName,
    role: role || 'manager', 
    isActive: true
  });

  await logActivity({
    user: user._id,
    action: `Registered new user: ${user.fullName} (${user.role})`,
    category: 'user',
    details: {
      email: user.email,
      fullName: user.fullName,
      role: user.role
    },
    userType: user.role,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    status: 'success'
  });

  // Send token response
  sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try{

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(new ErrorResponse("Your account has been deactivated", 401));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const token = jwt.sign(
    {id: user._id},
    process.env.JWT_SECRET,
    { expiresIn: "1d" } 
  );

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  await logActivity({
    user: user._id,
    action: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Login`,
    category: 'user',
    details: {
      email: user.email,
      loginTime: new Date().toISOString()
    },
    userType: user.role,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    status: 'success'
  });

  res
     .cookie("token", token, {
      httpOnly:true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 *1000,
     })
    .status(200).json({
    success: true,
    msg: "Login Successful",
    token,
    user: { id: user._id, email: user.email, fullName: user.fullName}
  });

} catch{
  res.status(500).json({msg: "Server error"});
}
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});


export const logout = asyncHandler(async (req, res, next) => {
  await logActivity({
    user: req.user.id,
    action: `${req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1)} Logout`,
    category: 'user',
    details: {
      email: req.user.email,
      logoutTime: new Date().toISOString()
    },
    userType: req.user.role,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    status: 'success'
  });

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Incorrect current password', 400));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
};