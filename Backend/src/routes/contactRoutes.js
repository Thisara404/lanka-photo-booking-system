// filepath: Backend/src/routes/contactRoutes.js
const express = require('express');
const { 
  submitContact,
  getContacts,
  getContactById,
  deleteContact
} = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route to submit a contact form
router.post('/', submitContact);

// Admin routes
router.get('/', protect, admin, getContacts);
router.get('/:id', protect, admin, getContactById);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;