import API from './api';

export const createBooking = (clientId, data) => API.post(`/bookings/client/${clientId}`, data);
export const cancelBooking = (bookingId, reason) => API.put(`/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason || '')}`);
export const rescheduleBooking = (bookingId, data) => API.put(`/bookings/${bookingId}/reschedule`, data);
export const approveBooking = (bookingId) => API.put(`/bookings/${bookingId}/approve`);
export const rejectBooking = (bookingId) => API.put(`/bookings/${bookingId}/reject`);
export const completeBooking = (bookingId) => API.put(`/bookings/${bookingId}/complete`);
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const getClientBookings = (clientId) => API.get(`/bookings/client/${clientId}`);
export const getBeauticianBookings = (beauticianId) => API.get(`/bookings/beautician/${beauticianId}`);
