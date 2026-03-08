import API from './api';

export const getAllBeauticians = () => API.get('/beauticians');
export const getBeauticianById = (id) => API.get(`/beauticians/${id}`);
export const getBeauticianByUserId = (userId) => API.get(`/beauticians/user/${userId}`);
export const createBeauticianProfile = (userId, data) => API.post(`/beauticians/${userId}`, data);
export const updateBeauticianProfile = (id, data) => API.put(`/beauticians/${id}`, data);
