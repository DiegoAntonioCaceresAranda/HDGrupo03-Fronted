import type { Venta } from "../../../data/Venta";
import type { Producto } from "../../../data/Producto";
import type { ActivityItem, AttentionOrder, HomeDashboardData, LowStockProduct } from "../types";
import { formatoMoneda } from "../../dashboard/utils/dashboardMetrics";

/** Mismo umbral que usa la tabla de Productos para marcar stock bajo. */
const UMBRAL_STOCK_BAJO = 15;

function esHoy(fechaIso: string, ahora = new Date()): boolean {
  const fecha = new Date(fechaIso);
  return (
    fecha.getFullYear() === ahora.getFullYear() &&
    fecha.getMonth() === ahora.getMonth() &&
    fecha.getDate() === ahora.getDate()
  );
}

function tiempoRelativo(fechaIso: string, ahora = new Date()): string {
  const diffMinutos = Math.max(0, Math.round((ahora.getTime() - new Date(fechaIso).getTime()) / 60000));
  if (diffMinutos < 1) return "Justo ahora";
  if (diffMinutos < 60) return `Hace ${diffMinutos} min`;
  const horas = Math.round(diffMinutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  return `Hace ${Math.round(horas / 24)} d`;
}

export function construirHomeDesdeVentas(ventas: Venta[], productos: Producto[]): HomeDashboardData {
  const ventasHoy = ventas.filter((v) => esHoy(v.fecha));

  const todaySales = ventasHoy.reduce((acc, v) => acc + v.total, 0);
  const todayOrders = ventasHoy.length;
  const newCustomersToday = new Set(
    ventasHoy
      .filter((v) => v.cliente && v.cliente.trim().length > 0)
      .map((v) => v.cliente!.trim().toLowerCase()),
  ).size;

  // El POS registra la venta ya pagada, así que no existe un estado real de "pago pendiente".
  // "Por despachar" es un proxy: pedidos Delivery de hoy que aún no se marcan como entregados.
  const attentionOrders: AttentionOrder[] = ventasHoy
    .filter((v) => v.tipoOrden === "Delivery")
    .slice(-5)
    .reverse()
    .map((v) => ({
      orderId: `#${v.ticket}`,
      customerName: v.cliente?.trim() || "Cliente de mostrador",
      reason: "Por despachar",
      amount: formatoMoneda(v.total),
    }));

  const lowStockProducts: LowStockProduct[] = productos
    .filter((p) => p.stock < UMBRAL_STOCK_BAJO)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)
    .map((p) => ({
      productId: String(p.id),
      name: p.nombre,
      stock: p.stock,
      threshold: UMBRAL_STOCK_BAJO,
    }));

  const actividadVentas: ActivityItem[] = [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)
    .map((v) => ({
      id: `venta-${v.id}`,
      type: "order",
      message: `Venta #${v.ticket} registrada${v.cliente ? ` para ${v.cliente}` : ""} (${formatoMoneda(v.total)})`,
      time: tiempoRelativo(v.fecha),
    }));

  const actividadStock: ActivityItem[] = lowStockProducts.slice(0, 3).map((p) => ({
    id: `stock-${p.productId}`,
    type: "stock",
    message: `${p.name} quedó con stock bajo (${p.stock} uds.)`,
    time: "Actualizado ahora",
  }));

  const activity = [...actividadVentas, ...actividadStock].slice(0, 8);

  return {
    quickStats: { todaySales, todayOrders, newCustomersToday },
    attentionOrders,
    lowStockProducts,
    activity,
  };
}
