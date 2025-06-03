const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['print', 'booking', 'preset'], // This is correct - enum as array
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // This is a dynamic reference based on itemType
    refPath: 'itemModelName'
  },
  // Add this field to support dynamic references
  itemModelName: {
    type: String,
    required: true,
    enum: ['Print', 'Booking', 'Preset'] // Model names should be capitalized
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paypalOrderId: {
    type: String
  },
  paypalPayerId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

// Remove this line which is causing the error
// PaymentSchema.path('itemType').enum(['print', 'booking', 'preset']);

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;