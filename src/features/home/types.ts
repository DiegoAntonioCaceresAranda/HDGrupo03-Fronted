export interface QuickStats {
  todaySales: number;
  todayOrders: number;
  newCustomersToday: number;
}

export type OrderAttentionReason = "Pago pendiente" | "Por despachar";

export interface AttentionOrder {
  orderId: string;
  customerName: string;
  reason: OrderAttentionReason;
  amount: string;
}

export interface LowStockProduct {
  productId: string;
  name: string;
  stock: number;
  threshold: number;
}

export type ActivityType = "order" | "customer" | "stock";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
}

export interface HomeDashboardData {
  quickStats: QuickStats;
  attentionOrders: AttentionOrder[];
  lowStockProducts: LowStockProduct[];
  activity: ActivityItem[];
}
