import axios from 'axios';

const API_URL = "http://localhost:8080";

export const BookingService = {
  createBookingRequest: async (token, bookingRequest) => {
    const response = await axios.post(`${API_URL}/booking-requests`, bookingRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getUserBookings: async (token, userId) => {
    const response = await axios.get(`${API_URL}/booking-requests/user-or-trainer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId }
    });
    return response.data;
  },
  getTrainerBookings: async (token, trainerId) => {
    const response = await axios.get(`${API_URL}/booking-requests/user-or-trainer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { trainerId }
    });
    return response.data;
  },
  approveBooking: async (token, bookingId) => {
    const response = await axios.put(`${API_URL}/booking-requests/${bookingId}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};