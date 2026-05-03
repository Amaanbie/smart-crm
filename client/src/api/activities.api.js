import api from './axios.js';

export const getActivities = (leadId) => api.get(`/leads/${leadId}/activities`).then((r) => r.data);
export const createActivity = (leadId, data) => api.post(`/leads/${leadId}/activities`, data).then((r) => r.data);
export const updateActivity = (id, data) => api.patch(`/activities/${id}`, data).then((r) => r.data);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
