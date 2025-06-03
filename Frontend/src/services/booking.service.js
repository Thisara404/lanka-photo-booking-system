import api from '@/api';

const BookingService = {
  getAllBookings: async () => {
    return api.get('/api/bookings');
  },
  
  getUserBookings: async () => {
    return api.get('/api/bookings/user'); 
  },
  
  updateBookingStatus: async (bookingId, status) => {
    return api.put(`/api/bookings/${bookingId}`, { status });
  },
  
  deleteBooking: async (bookingId) => {
    return api.delete(`/api/bookings/${bookingId}`);
  }
};

export default BookingService;