import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsForBooking,
} from '../controllers/payments.js';

const router = express.Router();

router.get('/', getPayments);
router.post('/', createPayment);
router.get('/booking/:bookingId', getPaymentsForBooking);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
