import FrontUser from '../models/FrontUser.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import { createActivityLog } from '../utils/activityLogger.js';

// @desc Get all front users
// @route GET /api/frontusers
// @access Private/Admin
export const getAllFrontUsers = asyncHandler(async (req, res, next) => {
  const users = await FrontUser.find({}).sort({ createdAt: -1 }).select('-password -resetPasswordToken -resetPasswordExpire');
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc Get single front user
// @route GET /api/frontusers/:id
// @access Private/Admin
export const getFrontUser = asyncHandler(async (req, res, next) => {
  const user = await FrontUser.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire');
  if (!user) return next(new ErrorResponse('Front user not found', 404));
  res.status(200).json({ success: true, data: user });
});

// @desc Update front user
// @route PUT /api/frontusers/:id
// @access Private/Admin
export const updateFrontUser = asyncHandler(async (req, res, next) => {
  // Prevents password updates here unless a dedicated endpoint is used
  const allowed = ['firstName', 'surname', 'email', 'gender', 'userType', 'studentNumber', 'nin'];
  const payload = {};
  Object.keys(req.body || {}).forEach(k => { if (allowed.includes(k)) payload[k] = req.body[k]; });

  const oldUser = await FrontUser.findById(req.params.id);
  const user = await FrontUser.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).select('-password -resetPasswordToken -resetPasswordExpire');
  if (!user) return next(new ErrorResponse('Front user not found', 404));
  
  await createActivityLog(
    req.user._id,
    `Updated front user: ${user.firstName} ${user.surname}`,
    'user',
    {
      userId: user._id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      userType: user.userType,
      changes: payload
    }
  );

  res.status(200).json({ success: true, data: user });
});

// @desc Delete front user
// @route DELETE /api/frontusers/:id
// @access Private/Admin
export const deleteFrontUser = asyncHandler(async (req, res, next) => {
  const user = await FrontUser.findById(req.params.id);
  if (!user) return next(new ErrorResponse('Front user not found', 404));
  
  const userData = {
    userId: user._id,
    firstName: user.firstName,
    surname: user.surname,
    email: user.email,
    userType: user.userType
  };

  await user.deleteOne();

  await createActivityLog(
    req.user._id,
    `Deleted front user: ${user.firstName} ${user.surname}`,
    'user',
    userData
  );

  res.status(200).json({ success: true, data: {} });
});
