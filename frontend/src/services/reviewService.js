import API from './api';

export const addReview = (clientId, data) => API.post(`/reviews/client/${clientId}`, data);
export const getReviewsByBeautician = (beauticianId) => API.get(`/reviews/beautician/${beauticianId}`);
