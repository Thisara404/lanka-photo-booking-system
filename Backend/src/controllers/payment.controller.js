const PaymentService = require('../services/payment.service');
const Print = require('../models/Print');
const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment'); // Assuming the path to your Payment model

// @desc    Create a payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { 
    itemId, 
    itemType, 
    amount, 
    metadata = {} 
  } = req.body;
  
  if (!itemId || !itemType) {
    res.status(400);
    throw new Error('Item ID and type are required');
  }
  
  let description = '';
  
  // Generate description based on item type
  if (itemType === 'print') {
    const print = await Print.findById(itemId);
    if (print) {
      description = `Print Purchase: ${print.name}`;
      if (metadata.printSize) description += ` - ${metadata.printSize}`;
      if (metadata.frame) description += ` with ${metadata.frame} frame`;
    }
  } else if (itemType === 'booking') {
    description = `Photography Session Booking`;
    if (metadata.category) description += ` - ${metadata.category}`;
  } else if (itemType === 'preset') {
    description = `Preset Package Purchase`;
    if (metadata.presetName) description += `: ${metadata.presetName}`;
  }
  
  const options = {
    userId: req.user._id,
    itemId,
    itemType,
    amount,
    description,
    metadata: {
      ...metadata,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  };
  
  const result = await PaymentService.createPaymentOrder(options);
  
  if (!result.success) {
    res.status(400);
    throw new Error(result.error);
  }
  
  res.status(200).json({
    status: true,
    data: result.data
  });
});

// @desc    Capture payment after user approval
// @route   GET /api/payments/capture
// @access  Public
exports.capturePayment = asyncHandler(async (req, res) => {
  const { token, PayerID } = req.query;
  
  if (!token) {
    res.status(400);
    throw new Error('Payment token is required');
  }
  
  const result = await PaymentService.capturePayment(token);
  
  if (!result.success) {
    // Redirect to error page with error details
    return res.redirect(`${process.env.CLIENT_URL}/payment/error?message=${encodeURIComponent(result.error)}`);
  }
  
  // Get the item type and ID from the request
  const { type, id } = req.query;
  
  // Find the pending payment record
  const payment = await Payment.findOne({ 
    paypalOrderId: token,
    itemType: type,
    itemId: id
  });
  
  if (payment) {
    // Update payment record
    payment.status = 'completed';
    payment.paypalPayerId = PayerID;
    await payment.save();
    
    // Process based on the type
    if (type === 'print') {
      // Update print purchase record or inventory
      await Print.findByIdAndUpdate(id, { $inc: { salesCount: 1 } });
    } else if (type === 'booking') {
      // Update booking status
      await Booking.findByIdAndUpdate(id, { status: 'confirmed', paymentStatus: 'paid' });
    } else if (type === 'preset') {
      // Update preset purchase record
      await Preset.findByIdAndUpdate(id, { $inc: { salesCount: 1 } });
    }
  }
  
  // Redirect to success page
  res.redirect(`${process.env.CLIENT_URL}/payment/success?type=${type}&id=${id}`);
});

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  // Assuming you have a Payment model
  const payments = await Payment.find({ user: req.user._id })
    .populate('itemId', 'name title') // Adjust fields based on your models
    .sort('-createdAt');
  
  res.status(200).json({
    status: true,
    data: payments
  });
});