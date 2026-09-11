import { useMemo, useState } from "react";
import { ProductoService } from "../../../services/ProductoService";
import { catergoriaService } from "../../../services/CategoriaService";
import type { Producto } from "../../../data/Producto";

export interface CategoriaOpcion {
  etiqueta: string;
  total: number;
}

interface UseProductosPOSResult {
  productos: Producto[];
  productosFiltrados: Producto[];
  categorias: CategoriaOpcion[];
  categoriaActiva: string;
  setCategoriaActiva: (categoria: string) => void;
  busqueda: string;
  setBusqueda: (valor: string) => void;
  refrescar: () => void;
}

const TODAS = "Todos";

export function useProductosPOS(): UseProductosPOSResult {
  const [productos, setProductos] = useState<Producto[]>(() => ProductoService.listarProductos());
  const [categoriaActiva, setCategoriaActiva] = useState<string>(TODAS);
  const [busqueda, setBusqueda] = useState("");

  const refrescar = () => setProductos(ProductoService.listarProductos());

  const categorias = useMemo<CategoriaOpcion[]>(() => {
    const nombresCategorias = catergoriaService.listarCategorias().map((c) => c.nombre);
    return [
      { etiqueta: TODAS, total: productos.length },
      ...nombresCategorias.map((nombre) => ({
        etiqueta: nombre,
        total: productos.filter((p) => p.categoria === nombre).length,
      })),
    ];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideCategoria = categoriaActiva === TODAS || producto.categoria === categoriaActiva;
      const coincideBusqueda =
        !busquedaNormalizada ||
        producto.nombre.toLowerCase().includes(busquedaNormalizada) ||
        producto.codigo.toLowerCase().includes(busquedaNormalizada);
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoriaActiva, busqueda]);

  return {
    productos,
    productosFiltrados,
    categorias,
    categoriaActiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    refrescar,
  };
}
