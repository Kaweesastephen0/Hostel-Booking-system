import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update-profile', updateProfile);
router.put('/change-password', changePassword);

export default router;