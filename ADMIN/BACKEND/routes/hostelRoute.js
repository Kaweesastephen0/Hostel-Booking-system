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

const router = express.Router();

// Public routes
router.get('/', getAllHostels);
router.get('/featured', getFeaturedHostels);
router.get('/premiumHostel', getPremiumHostels);
router.get('/affordable', getAffordableHostels);
router.get('/:id', getHostel);

// Temporary: make these routes public for local testing (remove this in production)
router.post('/', createHostel);
router.put('/:id', updateHostel);
router.delete('/:id', deleteHostel);



export default router;