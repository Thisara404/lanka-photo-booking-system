import axios from 'axios';

// Use baseURL with correct endpoint path
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API REQUEST: ${config.method.toUpperCase()} ${config.url}`, 
      config.data ? config.data : '', 
      token ? 'With Auth Token' : 'No Auth Token'
    );
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    console.log(`API RESPONSE (${response.status}): ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method
    } : error);

    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login
      console.log('Authentication error - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Starting API Request:', request.method, request.url);
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', 
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;