import express from 'express';
import {getAllHostels, getFeaturedHostels, getPremiumHostels, getAffordableHostels, getMidRangeHostels} from '../controllers/hostelController.js';
import { searchHostels, getLocations, getRoomTypes } from '../controllers/hostelSearchController.js';


const router = express.Router();



// getting all hostels
router.get('/', getAllHostels);
router.get('/featured', getFeaturedHostels)
router.get('/premium', getPremiumHostels)
router.get('/affordable', getAffordableHostels); 
router.get('/midrange', getMidRangeHostels);






export default router;