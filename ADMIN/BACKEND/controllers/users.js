import User from '../models/User.js';
import asyncHandler from '../middleware/async.js';

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
    role,
  } = req.query;

  const pageNumber = parsePositiveInt(page, 1);
  const limitNumber = parsePositiveInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const sortDirection = order === 'asc' ? 1 : -1;
  const sortField = typeof sort === 'string' && sort.trim() ? sort : 'createdAt';

  try {
    let adminQuery = {};
    let clientQuery = {};
    
    // Build search conditions
    const searchCondition = search && typeof search === 'string' ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    } : {};

    // Build status conditions
    const statusCondition = status === 'active' 
      ? { isActive: true } 
      : status === 'inactive' 
        ? { isActive: false } 
        : {};

    // For admin users (User model)
    adminQuery = { ...searchCondition, ...statusCondition };
    
    // For client users (FrontUser model)
    clientQuery = { ...searchCondition, ...statusCondition };

    // Fetch users from both models in parallel
    const [adminUsers, clientUsers, adminCount, clientCount] = await Promise.all([
      // Admin/Manager users
      User.find(adminQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      
      // Client users (from FrontUser model)
      FrontUser.find(clientQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      
      // Counts
      User.countDocuments(adminQuery),
      FrontUser.countDocuments(clientQuery)
    ]);

    // Format admin users
    const formattedAdminUsers = adminUsers.map(user => ({
      ...user,
      role: user.role || 'manager',
      userType: 'admin',
      source: 'admin'
    }));

    // Format client users
    const formattedClientUsers = clientUsers.map(user => ({
      ...user,
      role: 'client',
      userType: 'client',
      source: 'client',
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }));

    // Combine and sort all users
    const allUsers = [...formattedAdminUsers, ...formattedClientUsers];
    
    // Apply client-side sorting if needed (since we can't sort combined results in DB)
    allUsers.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (aValue < bValue) return sortDirection * -1;
      if (aValue > bValue) return sortDirection * 1;
      return 0;
    });

    // Apply pagination
    const paginatedUsers = allUsers.slice(0, limitNumber);
    const total = adminCount + clientCount;

  res.status(200).json({
    success: true,
    data: {
      users: paginatedUsers,
      total,
      page: pageNumber,
      limit: limitNumber,
    },
  });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
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

  await user.deleteOne();

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
