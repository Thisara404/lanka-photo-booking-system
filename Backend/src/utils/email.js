const nodemailer = require('nodemailer');

// Format date for email
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Mock email functionality since you're using EmailJS on the frontend
const sendBookingConfirmation = async (booking) => {
  try {
    // Log the booking details but don't try to send an email
    console.log('Booking confirmation would be sent for:', {
      name: booking.name,
      email: booking.email,
      category: booking.category,
      date: formatDate(booking.date),
      time: booking.time,
      status: booking.status
    });
    
    // Return success since we're just storing in DB and EmailJS handles actual sending
    return true;
  } catch (error) {
    console.error('Error in booking confirmation function:', error);
    // Don't fail the booking because of email issues
    return false;
  }
};

// Mock contact notification since you're using EmailJS
const sendContactNotification = async (contact) => {
  try {
    // Log the contact details but don't try to send an email
    console.log('Contact notification would be sent for:', {
      name: contact.name,
      email: contact.email,
      subject: contact.subject || 'No Subject'
    });
    
    // Return success since we're just storing in DB and EmailJS handles actual sending
    return {
      success: true,
      message: 'Contact stored in database successfully'
    };
  } catch (error) {
    console.error('Error in contact notification function:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendContactNotification,
};