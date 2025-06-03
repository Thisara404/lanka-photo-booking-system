import api from '@/api';

const AuthService = {
  // Set auth token for all future requests
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  
  // Reset auth token
  resetAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Register a new user
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Login user
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  // Logout user
  logout: () => {
    // Just remove token from client side
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Get current user data
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;