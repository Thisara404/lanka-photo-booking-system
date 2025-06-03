const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
  createBooking, 
  getBookings, 
  getUserBookings,
  getBookingById, 
  updateBookingStatus,
  deleteBooking,
  createBookingPayment
} = require('../controllers/bookingController');

const router = express.Router();

// Public route for creating bookings without authentication
router.post('/', createBooking);

// Protected routes
router.use(protect);

// Routes requiring authentication
router.get('/', getBookings);
router.get('/user', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

// Payment route
router.post('/:id/payment', createBookingPayment);

module.exports = router;