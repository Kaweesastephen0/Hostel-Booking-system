import express from 'express';
import {getAllHostels, getFeaturedHostels} from '../controllers/hostelController.js';

const router = express.Router();

// getting all hostels
router.get('/hostel', getAllHostels);
router.get('/featured', getFeaturedHostels)



export default router;