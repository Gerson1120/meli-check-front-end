import api from "./api";

export const OrderService = {
  // Dealer endpoints
  createOrder: (data) => api.post("/api/orders/", data),

  updateOrder: (orderId, data) => api.put(`/api/orders/${orderId}`, data),

  sendOrder: (orderId) => api.post(`/api/orders/${orderId}/send`),

  cancelOrder: (orderId) => api.post(`/api/orders/${orderId}/cancel`),

  getOrderById: (orderId) => api.get(`/api/orders/${orderId}`),

  getOrdersByVisit: (visitId) => api.get(`/api/orders/visit/${visitId}`),

  getMyOrders: () => api.get("/api/orders/my-orders"),

  // Admin endpoints
  filterOrders: (params) => {
    const queryParams = new URLSearchParams();
    if (params.dealerId) queryParams.append('dealerId', params.dealerId);
    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    return api.get(`/api/orders/filter?${queryParams.toString()}`);
  }
};