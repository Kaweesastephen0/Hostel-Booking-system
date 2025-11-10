import mongoose from 'mongoose';
import AdminUser from '../models/User.js';

// Import the User model from the main backend
import { Schema } from 'mongoose';

// Define the schema directly to avoid import issues
const FrontUserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Gender is required']
  },
  userType: {
    type: String,
    enum: ['student', 'non-student'],
    required: [true, 'User type is required']
  },
  phoneNumber: String,
  alternatePhone: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model using the existing connection
const frontUser = mongoose.models.frontUser || mongoose.model('frontUser', FrontUserSchema);

console.log('FrontUser model initialized with connection:', mongoose.connection.name);


// Get all admin/manager users
export const getAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', status } = req.query;
    
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const sortDirection = order === 'asc' ? 1 : -1;
    
    const query = {};
    
    // Handle search
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Handle status filter
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const [users, total] = await Promise.all([
      AdminUser.find(query)
        .sort({ [sort]: sortDirection })
        .skip(skip)
        .limit(limitNumber)
        .select('-password')
        .lean(),
      AdminUser.countDocuments(query)
    ]);
    
    // Format the response to match what the frontend expects
    const formattedUsers = users.map(user => ({
      ...user,
      id: user._id,
      role: user.role || 'manager',
      userType: 'admin',
      source: 'admin',
      isActive: user.isActive !== undefined ? user.isActive : true,
    }));
    
    res.status(200).json({
      success: true,
      data: {
        users: formattedUsers,
        total,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admin users',
      error: error.message 
    });
  }
};

// Get all client users
// Get all client users
export const getClientUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', status } = req.query;
    
    console.log('getClientUsers called with:', { page, limit, sort, order, search, status });
    
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;
    const sortField = sort || 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;
    
    // Build base query
    const query = {};
    
    // Handle search - only search in fields that exist in the schema
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { firstName: searchRegex },
        { surname: searchRegex },
        { email: searchRegex }
        // Removed phoneNumber as it might not exist in all schemas
      ];
    }
    
    // Handle status filter if needed
    if (status === 'active' || status === 'inactive') {
      query.isActive = status === 'active';
    }

    console.log('Client users query:', { query, sort: { [sortField]: sortDirection }, skip, limit: limitNumber });
    
    // Execute query with timeout
    const [clientUsers, clientCount] = await Promise.all([
      frontUser.find(query)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNumber)
        .select('-password -__v') // Exclude sensitive and unnecessary fields
        .lean()
        .maxTimeMS(30000) // 30 second timeout
        .exec(),
      frontUser.countDocuments(query).maxTimeMS(30000).exec()
    ]);
    
    console.log(`Found ${clientUsers.length} client users out of ${clientCount} total`);
    
    // Format response
    const formattedUsers = clientUsers.map(user => ({
      id: user._id?.toString(),
      _id: user._id?.toString(),
      fullName: `${user.firstName || ''} ${user.surname || ''}`.trim() || 'Unknown User',
      email: user.email || '',
      phoneNumber: user.phoneNumber,
      alternatePhone: user.alternatePhone,
      role: 'client',
      userType: 'client',
      source: 'client',
      isActive: user.isActive !== false, // Default to true if not set
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    res.status(200).json({
      success: true,
      data: {
        users: formattedUsers,
        total: clientCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(clientCount / limitNumber)
      }
    });
  } catch (error) {
    console.error('Error in getClientUsers:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching client users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: error 
      })
    });
  }
};

// Get all users (both admin and clients)
export const getAllUsers = async (req, res) => {
  console.log('getAllUsers called with query:', req.query);
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '', status } = req.query;
    
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;
    const sortField = sort || 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;
    
    // Build base queries
    const adminQuery = {};
    const clientQuery = {};
    
    // Handle search
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      
      adminQuery.$or = [
        { fullName: searchRegex },
        { email: searchRegex }
      ];
      
      clientQuery.$or = [
        { firstName: searchRegex },
        { surname: searchRegex },
        { email: searchRegex }
      ];
    }
    
    // Handle status filter
    if (status === 'active' || status === 'inactive') {
      const isActive = status === 'active';
      adminQuery.isActive = isActive;
      clientQuery.isActive = isActive;
    }
    
    console.log('Admin query:', JSON.stringify(adminQuery, null, 2));
    console.log('Client query:', JSON.stringify(clientQuery, null, 2));
    
    // First, get the counts
    const [adminCount, clientCount] = await Promise.all([
      AdminUser.countDocuments(adminQuery).maxTimeMS(30000).exec(),
      frontUser.countDocuments(clientQuery).maxTimeMS(30000).exec()
    ]);
    
    const totalCount = adminCount + clientCount;
    
    // Then fetch the data with pagination
    const [adminUsers, clientUsers] = await Promise.all([
      adminCount > 0 ? AdminUser.find(adminQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNumber)
        .select('-password -__v')
        .lean()
        .maxTimeMS(30000)
        .exec() : [],
      
      clientCount > 0 ? frontUser.find(clientQuery)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNumber)
        .select('-password -__v')
        .lean()
        .maxTimeMS(30000)
        .exec() : []
    ]);
    
    // Format admin users
    const formattedAdminUsers = adminUsers.map(user => ({
      ...user,
      id: user._id?.toString(),
      _id: user._id?.toString(),
      role: user.role || 'manager',
      userType: 'admin',
      source: 'admin',
      fullName: user.fullName || 'Admin User',
      isActive: user.isActive !== undefined ? user.isActive : true,
    }));
    
    // Format client users
    const formattedClientUsers = clientUsers.map(user => ({
      ...user,
      id: user._id?.toString(),
      _id: user._id?.toString(),
      role: 'client',
      userType: 'client',
      source: 'client',
      fullName: user.fullName || `${user.firstName || ''} ${user.surname || ''}`.trim() || 'Client User',
      isActive: user.isActive !== false, // Default to true if not set
    }));
    
    // Combine and sort all users
    const allUsers = [...formattedAdminUsers, ...formattedClientUsers];
    
    // Apply sorting based on the sort field
    allUsers.sort((a, b) => {
      // Handle different field types for sorting
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      // Convert dates to timestamps for proper comparison
      if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'lastLogin') {
        aValue = aValue instanceof Date ? aValue.getTime() : new Date(aValue).getTime() || 0;
        bValue = bValue instanceof Date ? bValue.getTime() : new Date(bValue).getTime() || 0;
      }
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection * aValue.localeCompare(bValue);
      }
      
      // Handle numeric comparison
      return sortDirection * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
    });
    
    // Apply pagination to the combined and sorted results
    const paginatedUsers = allUsers.slice(skip, skip + limitNumber);
    
    // Calculate total pages based on combined count
    const totalPages = Math.ceil(totalCount / limitNumber);
    
    console.log(`Returning ${paginatedUsers.length} users out of ${totalCount} total`);
    
    // Return the response
    res.status(200).json({
      success: true,
      data: {
        users: paginatedUsers,
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: totalPages
      }
    });
  } catch (error) {
    console.error('Error in getAllUsers:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error
      })
    });
  }
};

// Toggle user status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id, source } = req.params;
    let user;

    if (source === 'admin') {
      user = await AdminUser.findById(id);
    } else {
      user = await User.findById(id);
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Toggle status
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { source, id } = req.params;
    const Model = source === 'admin' ? AdminUser : User;
    
    const user = await Model.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First try to find in AdminUser
    let user = await AdminUser.findById(id).select('-password');
    let source = 'admin';
    
    // If not found in AdminUser, try in frontUser (client users)
    if (!user) {
      user = await frontUser.findById(id).select('-password');
      source = 'client';
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }
    
    // Convert to plain object if it's a Mongoose document
    const userObj = user.toObject ? user.toObject() : user;
    
    // Format the response to match frontend expectations
    res.status(200).json({
      success: true,
      data: {
        user: {
          ...userObj,
          id: userObj._id ? userObj._id.toString() : userObj.id,
          _id: userObj._id ? userObj._id.toString() : userObj.id,
          source,
          // Ensure these fields are included for the frontend
          fullName: userObj.fullName || `${userObj.firstName || ''} ${userObj.surname || ''}`.trim() || 'Unknown User',
          role: userObj.role || (source === 'admin' ? 'manager' : 'client'),
          isActive: userObj.isActive !== false, // Default to true if not set
          email: userObj.email || '',
          phoneNumber: userObj.phoneNumber || '',
          lastLogin: userObj.lastLogin,
          createdAt: userObj.createdAt,
          updatedAt: userObj.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create a new user (admin/manager only)
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }
    
    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }
    
    // Create new admin/manager user - password will be hashed by the pre-save hook
    const user = await AdminUser.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Will be hashed by pre-save hook
      role: role || 'manager',
      isActive: true
    });
    
    // Remove password from response
    const userData = user.toObject();
    delete userData.password;
    
    res.status(201).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // Don't allow updating password here
    if (updates.password) {
      delete updates.password;
    }
    
    // First try to find in AdminUser
    let user = await AdminUser.findById(id);
    let Model = AdminUser;
    
    // If not found in AdminUser, try in User
    if (!user) {
      user = await User.findById(id);
      Model = User;
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }
    
    // Update user
    Object.keys(updates).forEach(update => user[update] = updates[update]);
    await user.save();
    
    // Remove password from response
    const { password, ...userData } = user._doc;
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};
