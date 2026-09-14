import type { TipoOrden, MetodoPago } from "../../data/Venta";

export type { TipoOrden, MetodoPago };

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  stockDisponible: number;
}

export interface ResumenTicket {
  subtotal: number;
  descuentoPorcentaje: number;
  descuentoMonto: number;
  impuesto: number;
  total: number;
}
