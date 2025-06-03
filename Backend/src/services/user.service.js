import api from '../api';

const UserService = {
  updateProfile: (userData) => {
    return api.put('/users/profile', userData);
  },
  
  getUserBookings: () => {
    return api.get('/bookings/user');
  },
  
  // Admin functions
  getAllUsers: () => {
    return api.get('/users');
  },
  
  getUserById: (userId) => {
    return api.get(`/users/${userId}`);
  },
  
  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },
  
  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  },
};

export default UserService;