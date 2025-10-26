import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      trim: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Please provide the related booking'],
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'mobile', 'bank_transfer'],
      default: 'cash',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the payment amount'],
      min: [0, 'Amount must be greater than or equal to zero'],
    },
    notes: {
      type: String,
      trim: true,
    },
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre('save', function (next) {
  if (!this.reference) {
    this.reference = `PM-${Date.now().toString(36).toUpperCase()}`;
  }

  if (!this.paidAt && this.status === 'completed') {
    this.paidAt = new Date();
  }

  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
