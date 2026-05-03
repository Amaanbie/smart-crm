import api from './axios.js';

export const getLeads = (params) => api.get('/leads', { params }).then((r) => r.data);
export const getLead = (id) => api.get(`/leads/${id}`).then((r) => r.data);
export const createLead = (data) => api.post('/leads', data).then((r) => r.data);
export const updateLead = (id, data) => api.patch(`/leads/${id}`, data).then((r) => r.data);
export const updateLeadStatus = (id, status) => api.patch(`/leads/${id}/status`, { status }).then((r) => r.data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
