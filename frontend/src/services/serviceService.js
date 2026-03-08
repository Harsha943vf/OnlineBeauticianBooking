import API from './api';

export const getServicesByBeautician = (beauticianId) => API.get(`/services/beautician/${beauticianId}`);
export const addService = (beauticianId, data) => API.post(`/services/beautician/${beauticianId}`, data);
export const updateService = (serviceId, data) => API.put(`/services/${serviceId}`, data);
export const deleteService = (serviceId) => API.delete(`/services/${serviceId}`);
