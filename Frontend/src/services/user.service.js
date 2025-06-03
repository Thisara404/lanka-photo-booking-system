// src/services/user.service.js
import api from '@/api';

const UserService = {
  // Update user profile 
  updateUserProfile: async (userData) => {
    return api.put('/api/auth/update', userData);
  },
  
  // Get user's bookings - needs to have the /api prefix
  getUserBookings: async () => {
    return api.get('/api/bookings/user'); // Fix this URL
  }
};

export default UserService;