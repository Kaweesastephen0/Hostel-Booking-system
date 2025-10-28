import express from 'express';
import { getAllRooms } from '../controllers/roomController.js';

const router = express.Router();

// Route to get all rooms
router.route('/').get(getAllRooms);

export default router;