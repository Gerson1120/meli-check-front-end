import api from './api';

export const StoreService = {
  getAll: () => api.get('/api/stores/'),
  getActive: () => api.get('/api/stores/active'),
  getOne: (id) => api.get(`/api/stores/${id}`),
  create: (data) => api.post('/api/stores/', data),
  update: (id, data) => api.put(`/api/stores/${id}`, data),
  toggle: (id) => api.patch(`/api/stores/${id}/toggle`),
  getQr: (id) => api.get(`/api/stores/${id}/qr`, { responseType: "blob" }),
};
