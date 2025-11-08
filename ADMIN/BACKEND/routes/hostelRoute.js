import express from 'express';
import {
  getAllHostels,
  getFeaturedHostels,
  getPremiumHostels,
  getAffordableHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  getHostel,
  getMyHostels
} from '../controllers/hostelControllers.js';
import { protect, authorize, checkOwnership } from '../middleware/auth.js';
import Hostel from '../models/HostelModel.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedHostels);
router.get('/premiumHostel', getPremiumHostels);
router.get('/affordable', getAffordableHostels);
router.get('/:id', getHostel);

// Protected routes
router.use(protect);

// Get all hostels (filtered by manager if role is manager)
router.get('/', getAllHostels);

// Get hostels for the logged-in manager
router.get('/my-hostels', authorize('manager'), getMyHostels);

// Admin only routes
router.use(authorize('admin'));
router.post('/', createHostel);
router.route('/:id')
  .put(checkOwnership(Hostel))
  .delete(checkOwnership(Hostel));

// Manager routes for their own hostels
router.route('/')
  .post(authorize('manager'), createHostel);

router.route('/:id')
  .put(authorize('manager'), checkOwnership(Hostel), updateHostel)
  .delete(authorize('manager'), checkOwnership(Hostel), deleteHostel);

export default router;