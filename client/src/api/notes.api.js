import api from './axios.js';

export const getNotes = (leadId) => api.get(`/leads/${leadId}/notes`).then((r) => r.data);
export const createNote = (leadId, content) => api.post(`/leads/${leadId}/notes`, { content }).then((r) => r.data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
