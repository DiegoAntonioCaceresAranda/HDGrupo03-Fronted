import type { DashboardData, DateRange } from "../types";

const baseMockData: DashboardData = {
  ganancia: {
    total: 12450,
    cambioPorcentaje: 14.5,
  },
  pedidos: {
    total: 186,
    cambioPorcentaje: 8.2,
  },
  ticketPromedio: {
    cantidad: 66.94,
    cambioPorcentaje: -2.1,
  },
  deliveryPendiente: {
    contador: 12,
  },
  productoDestacado: [
    { nombre: "Espresso", valor: 340, alturaPcntj: 80, destacar: false },
    { nombre: "Latte", valor: 512, alturaPcntj: 100, destacar: true },
    { nombre: "Cafe Helado", valor: 210, alturaPcntj: 60, destacar: false },
    { nombre: "Croissant", valor: 150, alturaPcntj: 45, destacar: false },
    { nombre: "Cappuccino", valor: 290, alturaPcntj: 75, destacar: false },
  ],
  transacciones: [
    { tiempo: "08:15 AM", ordenId: "#ORD-0921", items: "2x Latte, 1x Croissant", estado: "Completado", cantidad: "$14.50" },
    { tiempo: "08:22 AM", ordenId: "#ORD-0922", items: "1x Espresso", estado: "Completado", cantidad: "$3.50" },
    { tiempo: "08:45 AM", ordenId: "#ORD-0923", items: "3x Cafe Helado, 2x Muffin", estado: "Pendiente", cantidad: "$24.00" },
    { tiempo: "09:10 AM", ordenId: "#ORD-0924", items: "1x Cappuccino", estado: "Completado", cantidad: "$4.75" },
    { tiempo: "09:32 AM", ordenId: "#ORD-0925", items: "2x Espresso, 1x Latte", estado: "Completado", cantidad: "$11.20" },
    { tiempo: "09:58 AM", ordenId: "#ORD-0926", items: "1x Cafe Helado", estado: "Pendiente", cantidad: "$5.30" },
    { tiempo: "10:14 AM", ordenId: "#ORD-0927", items: "4x Croissant", estado: "Completado", cantidad: "$16.00" },
    { tiempo: "10:40 AM", ordenId: "#ORD-0928", items: "2x Cappuccino, 1x Muffin", estado: "Completado", cantidad: "$13.75" },
    { tiempo: "11:05 AM", ordenId: "#ORD-0929", items: "1x Latte", estado: "Pendiente", cantidad: "$4.20" },
    { tiempo: "11:30 AM", ordenId: "#ORD-0930", items: "3x Espresso", estado: "Completado", cantidad: "$10.50" },
    { tiempo: "11:58 AM", ordenId: "#ORD-0931", items: "1x Cafe Helado, 1x Croissant", estado: "Completado", cantidad: "$8.90" },
  ],
};

export function getMockDashboardData(range: DateRange): DashboardData {
  const multiplier = range === "Hoy" ? 0.3 : range === "Este mes" ? 4 : 1;
  return {
    ...baseMockData,
    ganancia: {
      total: Math.round(baseMockData.ganancia.total * multiplier),
      cambioPorcentaje: baseMockData.ganancia.cambioPorcentaje,
    },
    pedidos: {
      total: Math.round(baseMockData.pedidos.total * multiplier),
      cambioPorcentaje: baseMockData.pedidos.cambioPorcentaje,
    },
    deliveryPendiente: baseMockData.deliveryPendiente,
  };
}
