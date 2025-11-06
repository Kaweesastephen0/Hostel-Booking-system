import express from 'express';
import {getAllHostels, getFeaturedHostels, getPremiumHostels, getAffordableHostels, getMidRangeHostels, getSearchbarQuery } from '../controllers/hostelController.js';

const router = express.Router();



// getting all hostels
router.get('/', getAllHostels);
router.get('/featured', getFeaturedHostels)
router.get('/premium', getPremiumHostels)
router.get('/affordable', getAffordableHostels); 
router.get('/midrange', getMidRangeHostels);
router.get('/search', getSearchbarQuery);  // ← Add this route






export default router;