import api from './axios.js';

export const login = (data) => api.post('/auth/login', data).then((r) => r.data);
export const register = (data) => api.post('/auth/register', data).then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data);
export const getUsers = () => api.get('/auth/users').then((r) => r.data);
