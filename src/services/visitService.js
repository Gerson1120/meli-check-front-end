import api from "./api";

export const VisitService = {
  getTodayVisits: () =>
    api.get("/visits/today").then(res => res.data),

  getOpenVisits: () =>
    api.get("/visits/open").then(res => res.data),

  getVisitById: (id) =>
    api.get(`/visits/${id}`).then(res => res.data),

  checkInByQr: (payload) =>
    api.post("/visits/check-in/qr", payload).then(res => res.data)
};
