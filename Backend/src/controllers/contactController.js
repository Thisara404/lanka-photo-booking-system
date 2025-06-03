// filepath: Backend/src/controllers/contactController.js
const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');
const { sendContactNotification } = require('../utils/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  if (contact) {
    // Try to send email notification
    try {
      const emailResult = await sendContactNotification(contact);
      
      const response = { 
        success: true, 
        message: 'Your message has been sent!',
        contact
      };
      
      // If in development, return the preview URL
      if (process.env.NODE_ENV === 'development' && emailResult?.previewUrl) {
        response.previewUrl = emailResult.previewUrl;
      }
      
      res.status(201).json(response);
    } catch (error) {
      console.error("Error sending email notification:", error);
      // Still return success since the contact was stored in DB
      res.status(201).json({
        success: true,
        message: 'Your message has been sent!',
        contact,
        emailError: "Email notification could not be sent, but your message was received."
      });
    }
  } else {
    res.status(400);
    throw new Error('Failed to submit contact form');
  }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Get contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    // Mark as read if not already
    if (!contact.read) {
      contact.read = true;
      await contact.save();
    }
    
    res.json(contact);
  } else {
    res.status(404);
    throw new Error('Contact message not found');
  }
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.deleteOne();
    res.json({ message: 'Contact message removed' });
  } else {
    res.status(404);
    throw new Error('Contact message not found');
  }
});

module.exports = {
  submitContact,
  getContacts,
  getContactById,
  deleteContact,
};