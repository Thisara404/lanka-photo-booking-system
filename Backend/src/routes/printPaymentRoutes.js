const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const printPaymentController = require('../controllers/printPaymentController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/create-order', printPaymentController.createPaymentOrder);
router.post('/capture/:orderId', printPaymentController.capturePayment);
router.get('/history', printPaymentController.getPaymentHistory);
router.get('/:purchaseId', printPaymentController.getPaymentDetails);

module.exports = router;