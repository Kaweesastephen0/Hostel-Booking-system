import express from 'express';
import {getAllHostels, getFeaturedHostels, getPremiumHostels, getAffordableHostels, getMidRangeHostels} from '../controllers/hostelController.js';

const router = express.Router();

// getting all hostels
router.get('/hostel', getAllHostels);
router.get('/featured', getFeaturedHostels)
router.get('/premiumHostel', getPremiumHostels)
router.get('/affordable', getAffordableHostels); 
router.get('/midRangeHostels', getMidRangeHostels);




export default router;