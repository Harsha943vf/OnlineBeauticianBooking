import API from './api';

export const getSlotsByBeautician = (beauticianId) => API.get(`/availability/beautician/${beauticianId}`);
export const getAvailableSlots = (beauticianId) => API.get(`/availability/beautician/${beauticianId}/available`);
export const addSlot = (beauticianId, data) => API.post(`/availability/beautician/${beauticianId}`, data);
export const updateSlot = (slotId, data) => API.put(`/availability/${slotId}`, data);
export const deleteSlot = (slotId) => API.delete(`/availability/${slotId}`);
