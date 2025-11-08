import express from 'express';
import {
  getAllHostels,
  getFeaturedHostels,
  getPremiumHostels,
  getAffordableHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  getHostel
} from '../controllers/hostelControllers.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import Hostel from '../models/HostelModel.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedHostels);
router.get('/premiumHostel', getPremiumHostels);
router.get('/affordable', getAffordableHostels);
router.get('/:id', getHostel);

// Protected routes - all routes below require authentication
router.use(protect);

// Get all hostels (automatically filtered by manager if role is manager)
router.get('/', getAllHostels);

// Create hostel (admin and manager)
router.post('/', authorize('admin', 'manager'), createHostel);

// Update and delete hostel (admin and manager with ownership check)
router.put('/:id', authorize('admin', 'manager'), checkOwnership(Hostel), updateHostel);
router.delete('/:id', authorize('admin', 'manager'), checkOwnership(Hostel), deleteHostel);

export default router;