import type { Venta } from "../../../data/Venta";
import type { Producto } from "../../../data/Producto";
import type { ActivityItem, AttentionOrder, HomeDashboardData, LowStockProduct } from "../types";
import { formatoMoneda } from "../../dashboard/utils/dashboardMetrics";

const UMBRAL_STOCK_BAJO = 15;

function esHoy(fechaIso: string): boolean {
  const fecha = new Date(fechaIso);
  const ahora = new Date();
  return (
    fecha.getFullYear() === ahora.getFullYear() &&
    fecha.getMonth() === ahora.getMonth() &&
    fecha.getDate() === ahora.getDate()
  );
}

function tiempoRelativo(fechaIso: string): string {
  const minutos = Math.round((Date.now() - new Date(fechaIso).getTime()) / 60000);
  if (minutos < 1) return "Hace instantes";
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `Hace ${dias} d`;
}

function construirLowStock(productos: Producto[]): LowStockProduct[] {
  return productos
    .filter((p) => p.stock < UMBRAL_STOCK_BAJO)
    .map((p) => ({
      productId: String(p.id),
      name: p.nombre,
      stock: p.stock,
      threshold: UMBRAL_STOCK_BAJO,
    }));
}

function construirAttentionOrders(ventasHoy: Venta[]): AttentionOrder[] {
  // El POS registra la venta ya completada; "por despachar" es un proxy con los pedidos
  // de tipo Delivery del día, ya que aún no existe un estado de entrega propio.
  return ventasHoy
    .filter((v) => v.tipoOrden === "Delivery")
    .slice(-6)
    .reverse()
    .map((v) => ({
      orderId: `#${v.ticket}`,
      customerName: v.cliente?.trim() || "Cliente sin registrar",
      reason: "Por despachar",
      amount: formatoMoneda(v.total),
    }));
}

function construirActividad(ventas: Venta[], lowStock: LowStockProduct[]): ActivityItem[] {
  const recientes = [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 8);

  const nombresPrevios = new Set<string>();
  const ordenAscendente = [...ventas].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const primeraAparicion = new Map<number, string>(); // ventaId -> nombre cliente si es su primera compra
  ordenAscendente.forEach((v) => {
    const nombre = v.cliente?.trim().toLowerCase();
    if (nombre && !nombresPrevios.has(nombre)) {
      primeraAparicion.set(v.id, v.cliente!.trim());
      nombresPrevios.add(nombre);
    }
  });

  const actividadVentas: ActivityItem[] = recientes.flatMap((v) => {
    const items: ActivityItem[] = [
      {
        id: `venta-${v.id}`,
        type: "order",
        message: `Venta #${v.ticket} registrada (${v.tipoOrden}${v.cliente ? ` · ${v.cliente}` : ""})`,
        time: tiempoRelativo(v.fecha),
      },
    ];

    const clienteNuevo = primeraAparicion.get(v.id);
    if (clienteNuevo) {
      items.push({
        id: `cliente-${v.id}`,
        type: "customer",
        message: `Nuevo cliente atendido: ${clienteNuevo}`,
        time: tiempoRelativo(v.fecha),
      });
    }

    return items;
  });

  const actividadStock: ActivityItem[] = lowStock.slice(0, 3).map((p) => ({
    id: `stock-${p.productId}`,
    type: "stock",
    message: `${p.name} quedó con stock bajo (${p.stock} unidades)`,
    time: "Alerta activa",
  }));

  return [...actividadVentas, ...actividadStock].slice(0, 8);
}

export function construirHomeDashboard(ventas: Venta[], productos: Producto[]): HomeDashboardData {
  const ventasHoy = ventas.filter((v) => esHoy(v.fecha));

  const nombresAntes = new Set(
    ventas.filter((v) => !esHoy(v.fecha) && v.cliente).map((v) => v.cliente!.trim().toLowerCase()),
  );
  const nombresHoy = new Set(
    ventasHoy.filter((v) => v.cliente).map((v) => v.cliente!.trim().toLowerCase()),
  );
  const newCustomersToday = [...nombresHoy].filter((nombre) => !nombresAntes.has(nombre)).length;

  const lowStockProducts = construirLowStock(productos);

  return {
    quickStats: {
      todaySales: ventasHoy.reduce((acc, v) => acc + v.total, 0),
      todayOrders: ventasHoy.length,
      newCustomersToday,
    },
    attentionOrders: construirAttentionOrders(ventasHoy),
    lowStockProducts,
    activity: construirActividad(ventas, lowStockProducts),
  };
}
