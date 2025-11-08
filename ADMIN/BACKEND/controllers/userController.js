import AdminUser from '../models/User.js'
import mongoose from 'mongoose';
import User from '../../../BACKEND/models/User.js'

// Get all admin/manager users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get all client users
export const getClientUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get all users (both admin and clients)
export const getAllUsers = async (req, res) => {
  try {
    const [adminUsers, clientUsers] = await Promise.all([
      AdminUser.find({}).select('-password'),
      User.find({}).select('-password')
    ]);
    
    // Combine and format the results
    const users = [
      ...adminUsers.map(user => ({
        ...user._doc,
        userType: 'admin',
        source: 'admin'
      })),
      ...clientUsers.map(user => ({
        ...user._doc,
        userType: user.userType || 'client',
        source: 'client',
        fullName: `${user.firstName} ${user.surname}`
      }))
    ];

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
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
    
    // If not found in AdminUser, try in User
    if (!user) {
      user = await User.findById(id).select('-password');
      source = 'client';
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...user._doc,
        source
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
    
    // Check if user already exists
    const existingUser = await AdminUser.findOne({ email }) || await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new admin/manager user
    const user = await AdminUser.create({
      fullName,
      email,
      password,
      role: role || 'manager'
    });
    
    // Remove password from response
    const { password: _, ...userData } = user._doc;
    
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
