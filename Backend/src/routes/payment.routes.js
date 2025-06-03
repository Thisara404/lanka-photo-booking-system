const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
  createOrder, 
  capturePayment,
  getPaymentHistory
} = require('../controllers/payment.controller');

const router = express.Router();

// Public route for PayPal return URL
router.get('/capture', capturePayment);

// Protected routes
router.use(protect);
router.post('/create-order', createOrder);
router.get('/history', getPaymentHistory);

module.exports = router;