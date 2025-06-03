import api from '../api';

export const PrintService = {
  // Get all prints with optional filtering
  async getPrints(filters = {}) {
    const { category, featured } = filters;
    let url = '/api/prints';
    
    // Add query parameters if provided
    const queryParams = [];
    if (category) queryParams.push(`category=${category}`);
    if (featured !== undefined) queryParams.push(`featured=${featured}`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  // Get a single print by ID
  async getPrintById(id) {
    const response = await api.get(`/api/prints/${id}`);
    return response.data;
  },
  
  // Create payment order for a print
  async createPaymentOrder(printId, options = {}) {
    try {
      const response = await api.post('/api/print-payments/create-order', {
        printId,
        size: options.size,
        frame: options.frame
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  },
  
  // Capture payment for a print
  async capturePayment(orderId) {
    try {
      const response = await api.post(`/api/print-payments/capture/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error capturing payment:', error);
      throw error;
    }
  },
  
  // Get user's print purchase history
  async getPurchaseHistory(page = 1, limit = 10) {
    try {
      const response = await api.get(`/api/print-payments/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      throw error;
    }
  },
  
  // Get details for a specific purchase
  async getPurchaseDetails(purchaseId) {
    try {
      const response = await api.get(`/api/print-payments/${purchaseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase details:', error);
      throw error;
    }
  },
  
  // Download a print with token
  async downloadPrint(token) {
    try {
      // This returns a blob that can be used to create a download
      const response = await api.get(`/api/prints/download/${token}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading print:', error);
      throw error;
    }
  }
};

export default PrintService;