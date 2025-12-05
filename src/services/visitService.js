import api from "./api";

export const VisitService = {
  getTodayVisits: () =>
    api.get("/api/visits/today"),

  getOpenVisits: () =>
    api.get("/api/visits/open"),

  getById: (id) =>
    api.get(`/api/visits/${id}`),

  getVisitById: (id) =>
    api.get(`/api/visits/${id}`),

  checkInByQr: (payload) =>
    api.post("/api/visits/check-in/qr", payload)
};