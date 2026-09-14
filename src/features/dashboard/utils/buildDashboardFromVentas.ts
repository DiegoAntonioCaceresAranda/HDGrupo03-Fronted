import type { Venta } from "../../../data/Venta";
import type { DashboardData, DateRange, ProductoDestacado, Transaccion } from "../types";
import { formatoMoneda } from "./dashboardMetrics";

interface Ventana {
  inicio: Date;
  fin: Date;
  inicioAnterior: Date;
  finAnterior: Date;
}

function calcularVentana(range: DateRange, ahora = new Date()): Ventana {
  const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const finDia = new Date(inicioDia);
  finDia.setDate(finDia.getDate() + 1);

  if (range === "Hoy") {
    const inicioAnterior = new Date(inicioDia);
    inicioAnterior.setDate(inicioAnterior.getDate() - 1);
    return { inicio: inicioDia, fin: finDia, inicioAnterior, finAnterior: inicioDia };
  }

  if (range === "Esta semana") {
    const inicio = new Date(inicioDia);
    inicio.setDate(inicio.getDate() - 6);
    const inicioAnterior = new Date(inicio);
    inicioAnterior.setDate(inicioAnterior.getDate() - 7);
    return { inicio, fin: finDia, inicioAnterior, finAnterior: inicio };
  }

  // "Este mes"
  const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);
  const inicioAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
  return { inicio, fin, inicioAnterior, finAnterior: inicio };
}

function dentroDe(venta: Venta, inicio: Date, fin: Date): boolean {
  const fecha = new Date(venta.fecha);
  return fecha >= inicio && fecha < fin;
}

function cambioPorcentaje(actual: number, anterior: number): number {
  if (anterior === 0) return actual > 0 ? 100 : 0;
  return Number((((actual - anterior) / anterior) * 100).toFixed(1));
}

function construirProductosDestacados(ventas: Venta[]): ProductoDestacado[] {
  const totalesPorProducto = new Map<string, number>();

  ventas.forEach((venta) => {
    venta.items.forEach((item) => {
      const actual = totalesPorProducto.get(item.nombre) ?? 0;
      totalesPorProducto.set(item.nombre, actual + item.precioUnitario * item.cantidad);
    });
  });

  const ordenados = Array.from(totalesPorProducto.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maximo = ordenados.length > 0 ? ordenados[0][1] : 0;

  return ordenados.map(([nombre, valor], index) => ({
    nombre,
    valor,
    alturaPcntj: maximo > 0 ? Math.round((valor / maximo) * 100) : 0,
    destacar: index === 0,
  }));
}

function construirTransacciones(ventas: Venta[]): Transaccion[] {
  return [...ventas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .map((venta) => ({
      tiempo: new Date(venta.fecha).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      ordenId: `#${venta.ticket}`,
      items: venta.items.map((item) => `${item.cantidad}x ${item.nombre}`).join(", "),
      estado: "Completado",
      cantidad: formatoMoneda(venta.total),
    }));
}

export function construirDashboardDesdeVentas(ventas: Venta[], range: DateRange): DashboardData {
  const { inicio, fin, inicioAnterior, finAnterior } = calcularVentana(range);

  const ventasPeriodo = ventas.filter((v) => dentroDe(v, inicio, fin));
  const ventasPeriodoAnterior = ventas.filter((v) => dentroDe(v, inicioAnterior, finAnterior));

  const gananciaTotal = ventasPeriodo.reduce((acc, v) => acc + v.total, 0);
  const gananciaAnterior = ventasPeriodoAnterior.reduce((acc, v) => acc + v.total, 0);

  const pedidosTotal = ventasPeriodo.length;
  const pedidosAnterior = ventasPeriodoAnterior.length;

  const ticketPromedioActual = pedidosTotal > 0 ? gananciaTotal / pedidosTotal : 0;
  const ticketPromedioAnterior = pedidosAnterior > 0 ? gananciaAnterior / pedidosAnterior : 0;

  // Nota: el POS registra la venta ya completada (no hay estado "en camino" todavía),
  // así que "pendientes de entrega" es un proxy: pedidos del tipo Delivery en el periodo.
  const deliveryPendiente = ventasPeriodo.filter((v) => v.tipoOrden === "Delivery").length;

  return {
    ganancia: { total: gananciaTotal, cambioPorcentaje: cambioPorcentaje(gananciaTotal, gananciaAnterior) },
    pedidos: { total: pedidosTotal, cambioPorcentaje: cambioPorcentaje(pedidosTotal, pedidosAnterior) },
    ticketPromedio: {
      cantidad: ticketPromedioActual,
      cambioPorcentaje: cambioPorcentaje(ticketPromedioActual, ticketPromedioAnterior),
    },
    deliveryPendiente: { contador: deliveryPendiente },
    productoDestacado: construirProductosDestacados(ventasPeriodo),
    transacciones: construirTransacciones(ventasPeriodo),
  };
}
