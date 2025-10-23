import express from 'express';
import { getAllRooms } from '../controllers/roomController.js'; 

const router = express.Router();

router.get('/Rooms', getAllRooms); 

export default router;