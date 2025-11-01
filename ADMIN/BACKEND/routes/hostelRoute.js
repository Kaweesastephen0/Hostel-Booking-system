import express from 'express';
import {getAllHostels, getFeaturedHostels, getPremiumHostels, getAffordableHostels} from '../controllers/hostelControllers.js';

const router = express.Router();

// getting all hostels
router.get('/', getAllHostels);
router.get('/featured', getFeaturedHostels)
router.get('/premiumHostel', getPremiumHostels)
router.get('/affordable', getAffordableHostels); 



export default router;