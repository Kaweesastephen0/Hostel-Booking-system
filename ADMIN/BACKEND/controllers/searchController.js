import User from '../models/User.js';
import FrontUser from '../models/FrontUser.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import HostelModel from '../models/HostelModel.js';
import Room from '../models/RoomModel.js';

export const globalSearch = async (req, res) => {
  try {
    const { query, type } = req.query;
    const userRole = req.user?.role;

    if (!query || query.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchTerm = query.trim().toLowerCase();
    const results = {
      users: [],
      frontUsers: [],
      hostels: [],
      rooms: [],
      bookings: [],
      payments: [],
      total: 0
    };

    const searchRegex = new RegExp(searchTerm, 'i');

    if (!type || type === 'users') {
      if (userRole === 'admin') {
        const users = await User.find({
          $or: [
            { fullName: searchRegex },
            { email: searchRegex },
            { role: searchRegex }
          ]
        }).select('-password').limit(10);
        results.users = users;
      }
    }

    if (!type || type === 'frontUsers') {
      const frontUsers = await FrontUser.find({
        $or: [
          { firstName: searchRegex },
          { surname: searchRegex },
          { email: searchRegex },
          { userType: searchRegex },
          { studentNumber: searchRegex }
        ]
      }).select('-password').limit(10);
      results.frontUsers = frontUsers;
    }

    if (!type || type === 'hostels') {
      const hostels = await HostelModel.find({
        $or: [
          { name: searchRegex },
          { location: searchRegex },
          { description: searchRegex }
        ]
      }).limit(10);
      results.hostels = hostels;
    }

    if (!type || type === 'rooms') {
      const rooms = await Room.find({
        $or: [
          { roomNumber: searchRegex },
          { roomType: searchRegex },
          { roomDescription: searchRegex }
        ]
      }).populate('hostelId', 'name').limit(10);
      results.rooms = rooms;
    }

    if (!type || type === 'bookings') {
      const bookings = await Booking.find({
        $or: [
          { reference: searchRegex },
          { guestName: searchRegex },
          { guestEmail: searchRegex },
          { guestPhone: searchRegex },
          { hostelName: searchRegex },
          { roomNumber: searchRegex }
        ]
      }).populate('manager', 'fullName email').limit(10);
      results.bookings = bookings;
    }

    if (!type || type === 'payments') {
      if (userRole === 'admin') {
        const payments = await Payment.find({
          $or: [
            { reference: searchRegex },
            { method: searchRegex },
            { status: searchRegex }
          ]
        }).populate('booking', 'reference guestName').limit(10);
        results.payments = payments;
      }
    }

    results.total = 
      results.users.length +
      results.frontUsers.length +
      results.hostels.length +
      results.rooms.length +
      results.bookings.length +
      results.payments.length;

    res.status(200).json({
      success: true,
      data: results,
      message: `Found ${results.total} results`
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

export const searchByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { query, page = 1, limit = 20 } = req.query;
    const userRole = req.user?.role;

    if (!query || query.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchTerm = query.trim().toLowerCase();
    const searchRegex = new RegExp(searchTerm, 'i');
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let data = [];
    let total = 0;

    switch (type) {
      case 'users':
        if (userRole !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized'
          });
        }
        total = await User.countDocuments({
          $or: [
            { fullName: searchRegex },
            { email: searchRegex }
          ]
        });
        data = await User.find({
          $or: [
            { fullName: searchRegex },
            { email: searchRegex }
          ]
        }).select('-password').skip(skip).limit(parseInt(limit));
        break;

      case 'frontusers':
        total = await FrontUser.countDocuments({
          $or: [
            { firstName: searchRegex },
            { surname: searchRegex },
            { email: searchRegex }
          ]
        });
        data = await FrontUser.find({
          $or: [
            { firstName: searchRegex },
            { surname: searchRegex },
            { email: searchRegex }
          ]
        }).select('-password').skip(skip).limit(parseInt(limit));
        break;

      case 'hostels':
        total = await HostelModel.countDocuments({
          $or: [
            { name: searchRegex },
            { location: searchRegex }
          ]
        });
        data = await HostelModel.find({
          $or: [
            { name: searchRegex },
            { location: searchRegex }
          ]
        }).skip(skip).limit(parseInt(limit));
        break;

      case 'rooms':
        total = await Room.countDocuments({
          $or: [
            { roomNumber: searchRegex },
            { roomType: searchRegex }
          ]
        });
        data = await Room.find({
          $or: [
            { roomNumber: searchRegex },
            { roomType: searchRegex }
          ]
        }).populate('hostelId', 'name').skip(skip).limit(parseInt(limit));
        break;

      case 'bookings':
        total = await Booking.countDocuments({
          $or: [
            { reference: searchRegex },
            { guestName: searchRegex },
            { guestEmail: searchRegex }
          ]
        });
        data = await Booking.find({
          $or: [
            { reference: searchRegex },
            { guestName: searchRegex },
            { guestEmail: searchRegex }
          ]
        }).populate('manager', 'fullName').skip(skip).limit(parseInt(limit));
        break;

      case 'payments':
        if (userRole !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized'
          });
        }
        total = await Payment.countDocuments({
          $or: [
            { reference: searchRegex },
            { status: searchRegex }
          ]
        });
        data = await Payment.find({
          $or: [
            { reference: searchRegex },
            { status: searchRegex }
          ]
        }).populate('booking', 'reference guestName').skip(skip).limit(parseInt(limit));
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid search type'
        });
    }

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      message: `Found ${total} ${type}`
    });
  } catch (error) {
    console.error('Search by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};
