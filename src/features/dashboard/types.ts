export interface ProductoDestacado {
  nombre: string;
  valor: number;
  alturaPcntj: number;
  destacar: boolean;
}

export type EstadoTransaccion = "Completado" | "Pendiente";

export interface Transaccion {
  tiempo: string;
  ordenId: string;
  items: string;
  estado: EstadoTransaccion;
  cantidad: string;
}

export type DateRange = "Hoy" | "Esta semana" | "Este mes";

export interface ResumenGanancia {
  total: number;
  cambioPorcentaje: number;
}

export interface ResumenPedidos {
  total: number;
  cambioPorcentaje: number;
}

export interface ResumenTicketPromedio {
  cantidad: number;
  cambioPorcentaje: number;
}

export interface ResumenDeliveryPendiente {
  contador: number;
}

export interface DashboardData {
  ganancia: ResumenGanancia;
  pedidos: ResumenPedidos;
  ticketPromedio: ResumenTicketPromedio;
  deliveryPendiente: ResumenDeliveryPendiente;
  productoDestacado: ProductoDestacado[];
  transacciones: Transaccion[];
}
