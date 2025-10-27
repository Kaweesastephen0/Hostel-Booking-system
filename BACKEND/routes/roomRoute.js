import express, { Router } from 'express';
import { getAllRooms, getRoomsByHostelId, getRoomById } from '../controllers/roomController.js'; 

const router = express.Router();

router.get('/', getAllRooms); 

router.get('/hostel/:hostelId', getRoomsByHostelId);
router.get('/:id', getRoomById);


export default router;