import express, { Router } from 'express';
import { getAllRooms, getRoomsByHostelId } from '../controllers/roomController.js'; 

const router = express.Router();

router.get('/hostel/:hostelId', getRoomsByHostelId);
router.get('/', getAllRooms); 


export default router;