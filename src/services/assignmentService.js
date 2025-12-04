import api from './api';

const BASE = '/api/assignments';

export const getAssignments = () => api.get(`${BASE}/`);
export const getAssignment = (id) => api.get(`${BASE}/${id}`);
export const getAssignmentsActive = () => api.get(`${BASE}/active`);

export const createAssignment = (data) => api.post(`${BASE}/`, data);
export const updateAssignment = (id, data) => api.put(`${BASE}/${id}`, data);

export const toggleAssignment = (id) => api.patch(`${BASE}/${id}/toggle`);

export const getAssignmentsByDealer = (dealerId) =>
  api.get(`${BASE}/dealer/${dealerId}`);

export const getAssignmentsByStore = (storeId) =>
  api.get(`${BASE}/store/${storeId}`);

export const getMyAssignments = () => api.get(`${BASE}/me`);

export const getMyAssignment = (id) =>
  api.get(`${BASE}/me/${id}`);
