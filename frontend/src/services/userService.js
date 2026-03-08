import API from './api';

export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const getUserBookings = (id) => API.get(`/users/${id}/bookings`);
