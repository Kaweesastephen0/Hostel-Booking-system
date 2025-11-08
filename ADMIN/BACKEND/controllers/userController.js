import AdminUser from '../models/User.js';
import mongoose from 'mongoose';
import User from '../../../../BACKEND/models/User.js';

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
    const { id, source } = req.params;
    
    if (source === 'admin') {
      await AdminUser.findByIdAndDelete(id);
    } else {
      await User.findByIdAndDelete(id);
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
