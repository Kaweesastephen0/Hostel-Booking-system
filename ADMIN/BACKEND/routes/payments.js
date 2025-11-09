import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsForBooking,
} from '../controllers/payments.js';
import { protect, authorize, checkOwnership, applyManagerFilter } from '../middleware/auth.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Protected routes - all payment routes require authentication
router.use(protect);

// Apply manager filter for viewing payments
router.use(applyManagerFilter);

router.get('/', getPayments);
router.post('/', authorize('admin', 'manager'), createPayment);
router.get('/booking/:bookingId', getPaymentsForBooking);
router.get('/:id', getPaymentById);
router.put('/:id', authorize('admin', 'manager'), checkOwnership(Payment), updatePayment);
router.delete('/:id', authorize('admin', 'manager'), checkOwnership(Payment), deletePayment);

export default router;
