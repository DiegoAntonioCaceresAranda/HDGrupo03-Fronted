import { useEffect, useMemo, useState } from "react";
import {
  ProductoService,
  type Producto,
} from "../../../services/ProductoService";
import { catergoriaService } from "../../../services/CategoriaService";
import type { Categoria } from "../../../data/Categoria";

const TODAS = "Todas";

export interface CategoriaOpcion {
  etiqueta: string;
  total: number;
}

interface UseProductosPOSResult {
  productos: Producto[];
  productosFiltrados: Producto[];
  categorias: CategoriaOpcion[];
  nombresCategorias: Record<number, string>;
  categoriaActiva: string;
  setCategoriaActiva: (categoria: string) => void;
  busqueda: string;
  setBusqueda: (valor: string) => void;
  refrescar: () => Promise<void>;
  cargando: boolean;
  error: string | null;
}

export function useProductosPOS(): UseProductosPOSResult {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [listaCategorias, setListaCategorias] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>(TODAS);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refrescar = async () => {
    try {
      setError(null);
      setProductos(await ProductoService.listarProductos());
    } catch {
      setError("No se pudieron cargar los productos.");
    }
  };

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [prods, cats] = await Promise.all([
          ProductoService.listarProductos(),
          catergoriaService.listarCategorias(),
        ]);
        setProductos(prods);
        setListaCategorias(cats);
      } catch {
        setError("No se pudo cargar el catálogo. ¿Está corriendo FastAPI?");
      } finally {
        setCargando(false);
      }
    };
    cargarTodo();
  }, []);

  const categorias = useMemo<CategoriaOpcion[]>(
    () => [
      { etiqueta: TODAS, total: productos.length },
      ...listaCategorias.map((c) => ({
        etiqueta: c.nombre,
        total: productos.filter((p) => p.id_categoria === c.id).length,
      })),
    ],
    [productos, listaCategorias],
  );

  // Mapa id -> nombre, para mostrar la categoría en cada tarjeta
  const nombresCategorias = useMemo<Record<number, string>>(
    () => Object.fromEntries(listaCategorias.map((c) => [c.id, c.nombre])),
    [listaCategorias],
  );

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    const idCategoriaActiva =
      categoriaActiva === TODAS
        ? null
        : listaCategorias.find((c) => c.nombre === categoriaActiva)?.id ?? null;

    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === TODAS ||
        producto.id_categoria === idCategoriaActiva;
      const coincideBusqueda =
        termino === "" ||
        (producto.nombre && producto.nombre.toLowerCase().includes(termino)) ||
        (producto.codigo && producto.codigo.toLowerCase().includes(termino));

      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, listaCategorias, categoriaActiva, busqueda]);

  return {
    productos,
    productosFiltrados,
    categorias,
    nombresCategorias,
    categoriaActiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    refrescar,
    cargando,
    error,
  };
}