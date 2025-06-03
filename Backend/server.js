require('dotenv').config();
// Load environment variables from config.js
require('./src/config/config');
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import routes - Using try-catch to identify the problematic route
let authRoutes, bookingRoutes, blogRoutes, galleryRoutes, productRoutes, userRoutes, contactRoutes, printRoutes, paymentRoutes, printPaymentRoutes;

try {
  authRoutes = require('./src/routes/authRoutes');
  console.log('authRoutes loaded successfully');
} catch (error) {
  console.error('Error loading authRoutes:', error.message);
}

try {
  bookingRoutes = require('./src/routes/bookingRoutes');
  console.log('bookingRoutes loaded successfully');
} catch (error) {
  console.error('Error loading bookingRoutes:', error.message);
}

// Better error handling for route imports
try {
  blogRoutes = require('./src/routes/blogRoutes');
  console.log('blogRoutes loaded successfully');
} catch (error) {
  console.error('Error loading blogRoutes:', error.message, error.stack);
}

try {
  galleryRoutes = require('./src/routes/galleryRoutes');
  console.log('galleryRoutes loaded successfully');
} catch (error) {
  console.error('Error loading galleryRoutes:', error.message);
}

try {
  productRoutes = require('./src/routes/productRoutes');
  console.log('productRoutes loaded successfully');
} catch (error) {
  console.error('Error loading productRoutes:', error.message);
}

try {
  userRoutes = require('./src/routes/userRoutes');
  console.log('userRoutes loaded successfully');
} catch (error) {
  console.error('Error loading userRoutes:', error.message);
}

// Load contactRoutes
try {
  contactRoutes = require('./src/routes/contactRoutes');
  console.log('contactRoutes loaded successfully');
} catch (error) {
  console.error('Error loading contactRoutes:', error.message);
}

// Add this with the other route imports
try {
  printRoutes = require('./src/routes/printRoutes');
  console.log('printRoutes loaded successfully');
} catch (error) {
  console.error('Error loading printRoutes:', error.message);
}

// Import payment routes
try {
  paymentRoutes = require('./src/routes/payment.routes');
  console.log('paymentRoutes loaded successfully');
} catch (error) {
  console.error('Error loading paymentRoutes:', error.message);
}

// Add this with the other route imports
try {
  printPaymentRoutes = require('./src/routes/printPaymentRoutes');
  console.log('printPaymentRoutes loaded successfully');
} catch (error) {
  console.error('Error loading printPaymentRoutes:', error.message);
}

// Connect to database
connectDB();

const app = express();

// Create custom morgan token for request body
morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    // Don't log sensitive information like passwords
    const body = { ...req.body };
    if (body.password) body.password = '***';
    return JSON.stringify(body);
  }
  return '';
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add morgan middleware with custom format
app.use(morgan(':method :url :status :response-time ms - :body'));

// Make uploads directory accessible as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - only use routes that were successfully loaded
if (authRoutes) app.use('/api/auth', authRoutes);
if (bookingRoutes) app.use('/api/bookings', bookingRoutes);
if (blogRoutes) app.use('/api/blog', blogRoutes);  // This should match the API calls in your frontend
if (galleryRoutes) app.use('/api/gallery', galleryRoutes);
if (productRoutes) app.use('/api/products', productRoutes);
if (userRoutes) app.use('/api/users', userRoutes);
if (contactRoutes) app.use('/api/contact', contactRoutes);
if (printRoutes) app.use('/api/prints', printRoutes);

// Mount routes with better error handling
try {
  if (paymentRoutes) {
    app.use('/api/payments', paymentRoutes);
    console.log('Payment routes mounted successfully');
  }
} catch (error) {
  console.error('Error mounting payment routes:', error);
}
// Update the path to uploads directory for static serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Then add this with the route mounting section
if (printPaymentRoutes) {
  app.use('/api/print-payments', printPaymentRoutes);
  console.log('Print payment routes mounted successfully');
}

// Basic route
app.get('/', (req, res) => {
  res.send('Lanka Photo Booking System API is running');
});

// Add a debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    modules: {
      blogRoutes: !!blogRoutes,
      galleryRoutes: !!galleryRoutes,
      productRoutes: !!productRoutes
    },
    directories: {
      uploads: fs.existsSync(path.join(__dirname, 'uploads')),
      blogUploads: fs.existsSync(path.join(__dirname, 'uploads/blog'))
    }
  });
});

// Error handler middleware
app.use(errorMiddleware);

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const printsDir = path.join(uploadsDir, 'prints');
const downloadsDir = path.join(uploadsDir, 'downloads');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));