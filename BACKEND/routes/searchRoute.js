import express from 'express'
import { getLocations, getRoomTypes, searchHostels } from '../controllers/hostelSearchController.js'

const router= express.Router()
// Search routes (most specific first)
router.get('/search', searchHostels);
router.get('/locations', getLocations);
router.get('/room-types', getRoomTypes);

export default router