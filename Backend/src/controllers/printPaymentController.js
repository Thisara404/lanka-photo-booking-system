const asyncHandler = require('express-async-handler');
const PrintPaymentService = require('../services/printPayment.services');
const PrintPurchase = require('../models/PrintPurchase');

// @desc    Create a payment order for a print
// @route   POST /api/print-payments/create-order
// @access  Private
exports.createPaymentOrder = asyncHandler(async (req, res) => {
  const { printId, size, frame } = req.body;
  
  if (!printId) {
    res.status(400);
    throw new Error('Print ID is required');
  }
  
  const options = {
    size,
    frame,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  };
  
  const order = await PrintPaymentService.createPaymentOrder(
    printId, 
    req.user._id, 
    options
  );
  
  if (!order.success) {
    res.status(400);
    throw new Error(order.error);
  }
  
  res.status(200).json({
    success: true,
    data: order.data
  });
});

// @desc    Capture payment for a print order
// @route   POST /api/print-payments/capture/:orderId
// @access  Private
exports.capturePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  
  const result = await PrintPaymentService.capturePayment(orderId);
  
  if (!result.success) {
    res.status(400);
    throw new Error(result.error);
  }
  
  res.status(200).json({
    success: true,
    data: result.data
  });
});

// @desc    Get payment details for a purchase
// @route   GET /api/print-payments/:purchaseId
// @access  Private
exports.getPaymentDetails = asyncHandler(async (req, res) => {
  const purchase = await PrintPurchase.findById(req.params.purchaseId)
    .populate('printId', 'name image price');
  
  if (!purchase) {
    res.status(404);
    throw new Error('Purchase not found');
  }
  
  // Check if this purchase belongs to the user
  if (purchase.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  res.status(200).json({
    success: true,
    data: purchase
  });
});

// @desc    Get user's print payment history
// @route   GET /api/print-payments/history
// @access  Private
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const skip = (page - 1) * limit;
  
  const purchases = await PrintPurchase.find({ userId: req.user._id })
    .populate('printId', 'name image price category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await PrintPurchase.countDocuments({ userId: req.user._id });
  
  res.status(200).json({
    success: true,
    data: {
      purchases,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalRecords: total
      }
    }
  });
});