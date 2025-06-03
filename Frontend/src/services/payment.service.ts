import api from '../api';

export const PaymentService = {
  createOrder: async (params: {
    itemId: string;
    itemType: 'print' | 'booking' | 'preset';
    amount: number;
    metadata?: any;
  }) => {
    const response = await api.post('/api/payments/create-order', params);
    return response.data;
  },
  
  getPaymentHistory: async () => {
    const response = await api.get('/api/payments/history');
    return response.data;
  }
};