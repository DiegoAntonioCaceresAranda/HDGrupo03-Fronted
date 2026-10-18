import { useState, useEffect, useMemo, useCallback } from "react";
import type { Producto } from "../../../data/Producto";
import type { Categoria } from "../../../data/Categoria";
import * as ProductoModule from "../../../services/ProductoService";
import * as CategoriaModule from "../../../services/CategoriaService";

export interface CategoriaOpcion {
  etiqueta: string;
  total: number;
}

export const useProductosPOS = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriasLista, setCategoriasLista] = useState<string[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todos");
  const [busqueda, setBusqueda] = useState<string>("");

  const cargarDatos = useCallback(async () => {
    try {
      const prodSrv: any =
        (ProductoModule as any).ProductoService ??
        (ProductoModule as any).default ??
        ProductoModule;

      const fnProd = prodSrv.obtenerProductosAPI ?? prodSrv.listarProductos;
      const resProductos = fnProd ? await Promise.resolve(fnProd()) : [];
      setProductos(Array.isArray(resProductos) ? resProductos : []);

      const catSrv: any =
        (CategoriaModule as any).CategoriaService ??
        (CategoriaModule as any).catergoriaService ??
        (CategoriaModule as any).default ??
        CategoriaModule;

      const fnCat = catSrv.obtenerCategoriasAPI ?? catSrv.listarCategorias;
      const resCategorias = fnCat ? await Promise.resolve(fnCat()) : [];
      const listaCat: Categoria[] = Array.isArray(resCategorias)
        ? resCategorias
        : [];

      setCategoriasLista(
        listaCat
          .map((c) => c.nombre)
          .filter((n): n is string => Boolean(n && n.trim() !== "")),
      );
    } catch (error) {
      console.error("Error al cargar datos del POS:", error);
      setProductos([]);
      setCategoriasLista([]);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const categorias = useMemo<CategoriaOpcion[]>(() => {
    const conteo = new Map<string, number>();

    categoriasLista.forEach((nombre) => {
      const limpio = nombre.trim();
      if (limpio) conteo.set(limpio, 0);
    });

    productos.forEach((p) => {
      const cat = p.categoria?.trim();
      if (cat) {
        conteo.set(cat, (conteo.get(cat) ?? 0) + 1);
      }
    });

    const opciones: CategoriaOpcion[] = [
      { etiqueta: "Todos", total: productos.length },
    ];

    conteo.forEach((total, etiqueta) => {
      opciones.push({ etiqueta, total });
    });

    return opciones;
  }, [categoriasLista, productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === "Todos" || producto.categoria === categoriaActiva;
      const termino = busqueda.trim().toLowerCase();
      const coincideBusqueda =
        termino === "" ||
        (producto.nombre && producto.nombre.toLowerCase().includes(termino)) ||
        (producto.codigo && producto.codigo.toLowerCase().includes(termino));

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
    refrescar: cargarDatos,
  };
};