import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAdminUsers,
  getClientUsers,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  createUser,
  getUserById,
  updateUser
} from '../controllers/userController.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

// Get only admin/manager users - must come before any :id routes
router.get('/admins', getAdminUsers);

// Get only client users - must come before any :id routes
router.get('/clients', getClientUsers);

// Get all users (both admin and clients)
router.get('/', getAllUsers);

// Create a new user (admin/manager only)
router.post('/', createUser);

// Get a single user by ID
router.get('/:id', getUserById);

// Update a user
router.put('/:id', updateUser);

// Toggle user status
router.patch('/:source/:id/status', toggleUserStatus);

// Delete user
router.delete('/:source/:id', deleteUser);

export default router;
