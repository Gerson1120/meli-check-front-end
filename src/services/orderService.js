import api from "./api";

export const OrderService = {
  // Crear pedido en borrador
  createOrder: (data) => api.post("/api/orders/", data),

  // Actualizar pedido (solo borradores)
  updateOrder: (orderId, data) => api.put(`/api/orders/${orderId}`, data),

  // Enviar pedido (PENDING -> SENT)
  sendOrder: (orderId) => api.post(`/api/orders/${orderId}/send`),

  // Cancelar pedido
  cancelOrder: (orderId) => api.post(`/api/orders/${orderId}/cancel`),

  // Obtener pedido por ID
  getOrderById: (orderId) => api.get(`/api/orders/${orderId}`),

  // Obtener pedidos por visita
  getOrdersByVisit: (visitId) => api.get(`/api/orders/visit/${visitId}`),

  // Obtener mis pedidos
  getMyOrders: () => api.get("/api/orders/my-orders"),
};