// controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { sendBookingConfirmation } = require('../utils/email');
const PaymentService = require('../services/payment.service');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    category,
    date,
    time,
    address,
    message,
    notes
  } = req.body;

  try {
    // Get the user ID from JWT token if available 
    let userId = null;
    
    // If there's a token in the request Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        console.log("Creating booking with authenticated user ID:", userId);
      } catch (tokenError) {
        console.log("Invalid token, creating booking without user association");
      }
    } else {
      // Try to find user by email for anonymous bookings
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        userId = existingUser._id;
        console.log("Found matching user by email:", userId);
      } else {
        console.log("No matching user found, creating anonymous booking");
      }
    }

    // Ensure phone has a default value if it's empty
    const formattedPhone = phone || "0000000000";
    
    const booking = await Booking.create({
      user: userId, // Will be null for anonymous bookings
      name,
      email,
      phone: formattedPhone, // Use formatted phone number
      category,
      date,
      time,
      address: address || "",
      notes: notes || message || "", // Use either notes or message field
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log("Booking created successfully:", booking._id, "User ID:", userId || "Anonymous");

    // Send booking confirmation email
    sendBookingConfirmation(booking).catch(error => {
      console.error("Email confirmation error:", error);
    });
    
    // Update the response format to match what frontend expects
    res.status(201).json({
      success: true,
      booking: booking
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(400).json({ 
      message: `Booking creation failed: ${error.message}`,
      error: error
    });
  }
});

// @desc    Create payment for booking
// @route   POST /api/bookings/:id/payment
// @access  Private
const createBookingPayment = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { depositAmount } = req.body;
  
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }
    
    // Verify the booking belongs to this user if there's a user ID on the booking
    if (booking.user && booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
    
    // Get the booking's category for description
    let description = `Booking: ${booking.category} Session`;
    
    // Create payment order
    const result = await PaymentService.createPaymentOrder({
      userId: req.user._id,
      itemId: booking._id,
      itemType: 'booking',
      amount: depositAmount || booking.depositAmount || 5000, // Default deposit amount
      description: description,
      metadata: {
        category: booking.category,
        date: booking.date,
        time: booking.time
      }
    });
    
    if (!result.success) {
      res.status(400);
      throw new Error(result.error);
    }
    
    console.log("Payment order created successfully:", result.data);
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'An error occurred while processing payment'
    });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  console.log("Fetching bookings for user ID:", req.user._id);
  
  try {
    // Check for bookings by user ID
    let bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // If no bookings found by user ID, try to find by email (for bookings made before login)
    if (bookings.length === 0 && req.user.email) {
      console.log("No bookings found by user ID, trying email:", req.user.email);
      bookings = await Booking.find({ email: req.user.email }).sort({ createdAt: -1 });
      
      // If found bookings by email, update them to associate with the user ID
      if (bookings.length > 0) {
        console.log(`Found ${bookings.length} bookings by email, updating with user ID`);
        
        for (const booking of bookings) {
          if (!booking.user) {
            booking.user = req.user._id;
            await booking.save();
            console.log("Updated booking:", booking._id);
          }
        }
      }
    }
    
    console.log(`Found ${bookings.length} bookings for user`);
    res.json(bookings);
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // Check if the booking belongs to the user or if user is admin
    if (
      (booking.user && booking.user.toString() === req.user._id.toString()) ||
      req.user.role === 'admin'
    ) {
      res.json(booking);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this booking');
    }
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = status;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Delete booking by ID
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  await booking.deleteOne();
  res.json({ message: 'Booking removed' });
});

module.exports = {
  createBooking,
  createBookingPayment,
  getBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};