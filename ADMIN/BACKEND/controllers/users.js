import User from '../models/User.js';
import asyncHandler from '../middleware/async.js';
import { createActivityLog } from '../utils/activityLogger.js';

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const formatUserResponse = (user) => {
  if (!user) return null;

  const source = typeof user.toObject === 'function' ? user.toObject() : user;

  return {
    id: source.id || source._id,
    fullName: source.fullName,
    email: source.email,
    role: source.role,
    isActive: source.isActive,
    lastLogin: source.lastLogin,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
};

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role = 'manager', isActive } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email, and password are required.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'A user with this email already exists.',
    });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    isActive: typeof isActive === 'boolean' ? isActive : true,
  });

  await createActivityLog(
    req,
    `Created user: ${user.fullName} (${role})`,
    'user',
    {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    }
  );

  res.status(201).json({
    success: true,
    data: {
      user: formatUserResponse(user),
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    search = '',
    status,
  } = req.query;

  const pageNumber = parsePositiveInt(page, 1);
  const limitNumber = parsePositiveInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const sortDirection = order === 'asc' ? 1 : -1;
  const sortField = typeof sort === 'string' && sort.trim() ? sort : 'createdAt';

  const query = {};

  if (search && typeof search === 'string') {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: users.map(formatUserResponse),
      total,
      page: pageNumber,
      limit: limitNumber,
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: formatUserResponse(user),
    },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, email, role, isActive, password } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Another user already uses this email.',
      });
    }
    user.email = email;
  }

  if (fullName) {
    user.fullName = fullName;
  }

  if (role) {
    user.role = role;
  }

  if (typeof isActive === 'boolean') {
    user.isActive = isActive;
  }

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }
    user.password = password;
  }

  const updatedUser = await user.save();

  await createActivityLog(
    req,
    `Updated user: ${updatedUser.fullName}`,
    'user',
    {
      userId: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      changes: { fullName, email, role, isActive }
    }
  );

  res.status(200).json({
    success: true,
    data: {
      user: formatUserResponse(updatedUser),
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const userData = {
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };

  await user.deleteOne();

  await createActivityLog(
    req,
    `Deleted user: ${user.fullName}`,
    'user',
    userData
  );

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body ?? {};

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (typeof isActive === 'boolean') {
    user.isActive = isActive;
  } else {
    user.isActive = !user.isActive;
  }

  const updatedUser = await user.save({ validateBeforeSave: false });

  await createActivityLog(
    req,
    `${isActive !== undefined ? (isActive ? 'Activated' : 'Deactivated') : 'Toggled status of'} user: ${updatedUser.fullName}`,
    'user',
    {
      userId: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      isActive: updatedUser.isActive
    }
  );

  res.status(200).json({
    success: true,
    data: {
      user: formatUserResponse(updatedUser),
    },
  });
});

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
