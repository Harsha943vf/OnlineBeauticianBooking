import API from './api';

export const getAllUsers = () => API.get('/admin/users');
export const getAllBeauticians = () => API.get('/admin/beauticians');
export const getAllBookings = () => API.get('/admin/bookings');
export const getAllReviews = () => API.get('/admin/reviews');
export const deleteReview = (reviewId) => API.delete(`/admin/reviews/${reviewId}`);
export const deactivateUser = (userId) => API.delete(`/admin/users/${userId}`);
