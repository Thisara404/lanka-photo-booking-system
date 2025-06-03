const mongoose = require('mongoose');

const printPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  printId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Print',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  paypalOrderId: {
    type: String
  },
  paymentDetails: {
    captureId: String,
    paymentMethod: String,
    paymentTimestamp: Date
  },
  selectedSize: {
    type: String
  },
  frameOption: {
    type: String
  },
  downloadLink: {
    type: String
  },
  downloadExpiry: {
    type: Date
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  metadata: {
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Indexes
printPurchaseSchema.index({ userId: 1 });
printPurchaseSchema.index({ printId: 1 });
printPurchaseSchema.index({ status: 1 });
printPurchaseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PrintPurchase', printPurchaseSchema);