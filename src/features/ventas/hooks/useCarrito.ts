import { useMemo, useState } from "react";
import { calcularResumen } from "../utils/posCalculations";
import type { ItemCarrito, ResumenTicket } from "../types";
import type { Producto } from "../../../data/Producto";

interface UseCarritoResult {
  articulos: ItemCarrito[];
  cantidadTotal: number;
  descuentoPorcentaje: number;
  resumen: ResumenTicket;
  error: string | null;
  agregarProducto: (producto: Producto) => void;
  actualizarCantidad: (productoId: number, delta: number) => void;
  eliminarArticulo: (productoId: number) => void;
  aplicarDescuento: (porcentaje: number) => void;
  limpiarCarrito: () => void;
}

export function useCarrito(): UseCarritoResult {
  const [articulos, setArticulos] = useState<ItemCarrito[]>([]);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const agregarProducto = (producto: Producto) => {
    setError(null);
    setArticulos((anterior) => {
      const existente = anterior.find((articulo) => articulo.productoId === producto.id);
      const cantidadActual = existente?.cantidad ?? 0;

      if (cantidadActual + 1 > producto.stock) {
        setError(`No hay más stock disponible de "${producto.nombre}".`);
        return anterior;
      }

      if (existente) {
        return anterior.map((articulo) =>
          articulo.productoId === producto.id ? { ...articulo, cantidad: articulo.cantidad + 1 } : articulo,
        );
      }

      return [
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precioUnitario: producto.precioVenta,
          cantidad: 1,
          stockDisponible: producto.stock,
        },
        ...anterior,
      ];
    });
  };

  const actualizarCantidad = (productoId: number, delta: number) => {
    setError(null);
    setArticulos((anterior) =>
      anterior
        .map((articulo) => {
          if (articulo.productoId !== productoId) return articulo;
          const nuevaCantidad = articulo.cantidad + delta;
          if (delta > 0 && nuevaCantidad > articulo.stockDisponible) {
            setError(`No hay más stock disponible de "${articulo.nombre}".`);
            return articulo;
          }
          return { ...articulo, cantidad: nuevaCantidad };
        })
        .filter((articulo) => articulo.cantidad > 0),
    );
  };

  const eliminarArticulo = (productoId: number) => {
    setArticulos((anterior) => anterior.filter((articulo) => articulo.productoId !== productoId));
  };

  const limpiarCarrito = () => {
    setArticulos([]);
    setDescuentoPorcentaje(0);
    setError(null);
  };

  const cantidadTotal = useMemo(
    () => articulos.reduce((acumulado, articulo) => acumulado + articulo.cantidad, 0),
    [articulos],
  );
  const resumen = useMemo(
    () => calcularResumen(articulos, descuentoPorcentaje),
    [articulos, descuentoPorcentaje],
  );

  return {
    articulos,
    cantidadTotal,
    descuentoPorcentaje,
    resumen,
    error,
    agregarProducto,
    actualizarCantidad,
    eliminarArticulo,
    aplicarDescuento: setDescuentoPorcentaje,
    limpiarCarrito,
  };
}
