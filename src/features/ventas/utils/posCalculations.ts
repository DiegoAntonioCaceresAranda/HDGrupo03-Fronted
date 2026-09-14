import type { ItemCarrito, ResumenTicket } from "../types";

export const TASA_IMPUESTO = 0.18;

export function calcularSubtotal(articulos: ItemCarrito[]): number {
  return articulos.reduce((acumulado, articulo) => acumulado + articulo.precioUnitario * articulo.cantidad, 0);
}

export function calcularResumen(articulos: ItemCarrito[], descuentoPorcentaje = 0): ResumenTicket {
  const subtotal = calcularSubtotal(articulos);
  const descuentoMonto = subtotal * (descuentoPorcentaje / 100);
  const baseImponible = subtotal - descuentoMonto;
  const impuesto = baseImponible * TASA_IMPUESTO;
  const total = baseImponible + impuesto;

  return { subtotal, descuentoPorcentaje, descuentoMonto, impuesto, total };
}
