import api from "../../../config/axios";
import type { HomeDashboardData } from "../types";

// Cambia a false cuando el backend exponga GET /dashboard/home
const USE_MOCK_DATA = true;

const mockData: HomeDashboardData = {
  quickStats: {
    todaySales: 890,
    todayOrders: 14,
    newCustomersToday: 3,
  },
  attentionOrders: [
    { orderId: "#ORD-0931", customerName: "Rosa Medina", reason: "Pago pendiente", amount: "$45.00" },
    { orderId: "#ORD-0932", customerName: "Carlos Vera", reason: "Por despachar", amount: "$28.50" },
    { orderId: "#ORD-0933", customerName: "Ana Torres", reason: "Por despachar", amount: "$67.20" },
    { orderId: "#ORD-0934", customerName: "Luis Prado", reason: "Pago pendiente", amount: "$15.00" },
  ],
  lowStockProducts: [
    { productId: "p1", name: "Café en grano 500g", stock: 3, threshold: 10 },
    { productId: "p2", name: "Leche de avena 1L", stock: 5, threshold: 15 },
    { productId: "p3", name: "Vaso térmico 12oz", stock: 2, threshold: 8 },
  ],
  activity: [
    { id: "a1", type: "order", message: "Nuevo pedido #ORD-0934 de Luis Prado", time: "Hace 5 min" },
    { id: "a2", type: "customer", message: "Nuevo cliente registrado: Ana Torres", time: "Hace 22 min" },
    { id: "a3", type: "stock", message: "Vaso térmico 12oz quedó con stock bajo", time: "Hace 1 h" },
    { id: "a4", type: "order", message: "Pedido #ORD-0930 marcado como entregado", time: "Hace 2 h" },
  ],
};

/**
 * Trae el resumen general para la portada del panel admin (Dashboard).
 * TODO: apuntar al endpoint real y poner USE_MOCK_DATA en false.
 */
export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  if (USE_MOCK_DATA) {
    return mockData;
  }
  const { data } = await api.get<HomeDashboardData>("/dashboard/home");
  return data;
}
