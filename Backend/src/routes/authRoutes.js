const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
// Protected route
router.get('/me', protect, getMe);

// Keep the test route for now
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router;