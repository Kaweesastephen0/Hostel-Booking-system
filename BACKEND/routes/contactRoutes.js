import express from 'express';
import { contactValidationRules, validate } from '../middleware/validation.js';
import {
  submitContactForm,
  getContactSubmissions,
  getContactById,
  updateContactStatus
} from '../controllers/contactController.js';

const router = express.Router();

// Public routes
router.post('/submit', contactValidationRules(), validate, submitContactForm);

// Admin routes (you might want to add authentication middleware)
router.get('/submissions', getContactSubmissions);
router.get('/submissions/:id', getContactById);
router.patch('/submissions/:id/status', updateContactStatus);

export default router;