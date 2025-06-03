const express = require('express');
const { 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Private routes
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;