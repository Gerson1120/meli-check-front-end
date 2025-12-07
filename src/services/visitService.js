import api from "./api";

export const VisitService = {
  // Dealer endpoints
  getTodayVisits: () =>
    api.get("/api/visits/today"),

  getOpenVisits: () =>
    api.get("/api/visits/open"),

  getById: (id) =>
    api.get(`/api/visits/${id}`),

  getVisitById: (id) =>
    api.get(`/api/visits/${id}`),

  checkInByQr: (payload) =>
    api.post("/api/visits/check-in/qr", payload),

  // Admin endpoints
  getVisitsByDealer: (dealerId) =>
    api.get(`/api/visits/dealer/${dealerId}`),

  getVisitsByDealerAndDate: (dealerId, date) =>
    api.get(`/api/visits/dealer/${dealerId}/date/${date}`),

  getVisitsByStoreAndDate: (storeId, date) =>
    api.get(`/api/visits/store/${storeId}/date/${date}`),

  filterVisits: (params) => {
    const queryParams = new URLSearchParams();
    if (params.dealerId) queryParams.append('dealerId', params.dealerId);
    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    return api.get(`/api/visits/filter?${queryParams.toString()}`);
  }
};