import api from '@/api';

const ContactService = {
  getAllContacts: async () => {
    return api.get('/api/contact');
  },
  
  getContactById: async (id) => {
    return api.get(`/api/contact/${id}`);
  },
  
  deleteContact: async (id) => {
    return api.delete(`/api/contact/${id}`);
  },
  
  submitContact: async (contactData) => {
    return api.post('/api/contact', contactData);
  }
};

export default ContactService;