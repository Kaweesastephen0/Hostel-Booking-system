import express from 'express';
import {getAllHostels, getFeaturedHostels, getPremiumHostels, getAffordableHostels} from '../controllers/hostelController.js';

const router = express.Router();

// getting all hostels
router.get('/hostel', getAllHostels);
router.get('/featured', getFeaturedHostels)
router.get('/premiumHostel', getPremiumHostels)
router.get('/affordable', getAffordableHostels); 



export default router;