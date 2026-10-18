import api from "../config/axios";
import productosMock, { type Producto } from "../data/Producto";
import { catergoriaService, obtenerCategoriasCache } from "./CategoriaService";

const STORAGE_KEY = "productos";

interface ProductoBackend {
  id_producto: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock: number;
  id_categoria: number | null;
  image_url: string | null;
  image_public_id: string | null;
}

export interface ProductoPayload {
  nombre: string;
  precioVenta: number;
  stock: number;
  id_categoria?: number | null;
  categoria?: string;
  imagen?: File | null;
}

const mapearProducto = (
  p: ProductoBackend,
  categoriasMap: Map<number, string>,
): Producto => ({
  id: p.id_producto,
  codigo: p.codigo,
  nombre: p.nombre,
  precioVenta: Number(p.precio_venta),
  stock: p.stock,
  id_categoria: p.id_categoria,
  categoria:
    (p.id_categoria ? categoriasMap.get(p.id_categoria) : undefined) ||
    "Sin categoría",
  image_url: p.image_url,
  image_public_id: p.image_public_id,
});

// Función síncrona de respaldo para no romper Ventas / POS mientras carga
const listarProductos = (): Producto[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : productosMock;
};

// READ (Asíncrono desde FastAPI + Supabase + Cloudinary)
const obtenerProductosAPI = async (): Promise<Producto[]> => {
  try {
    const [resProductos, categorias] = await Promise.all([
      api.get<ProductoBackend[]>("/productos/"),
      catergoriaService.listarCategorias(),
    ]);

    const categoriasMap = new Map<number, string>(
      categorias.map((c) => [c.id, c.nombre]),
    );

    const productos = resProductos.data.map((p) =>
      mapearProducto(p, categoriasMap),
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    return productos;
  } catch (error) {
    console.error("Error al obtener productos del backend:", error);
    return listarProductos();
  }
};

// CREATE (Envía FormData con imagen a Cloudinary)
const crearProducto = async (datos: ProductoPayload): Promise<Producto> => {
  const formData = new FormData();
  formData.append("nombre", datos.nombre);
  formData.append("precio_venta", String(datos.precioVenta));
  formData.append("stock", String(datos.stock));

  if (datos.id_categoria) {
    formData.append("id_categoria", String(datos.id_categoria));
  }
  if (datos.imagen) {
    formData.append("imagen", datos.imagen);
  }

  const { data } = await api.post<ProductoBackend>("/productos/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const categorias = obtenerCategoriasCache();
  const categoriasMap = new Map(categorias.map((c) => [c.id, c.nombre]));
  return mapearProducto(data, categoriasMap);
};

// UPDATE (Envía FormData con nueva imagen opcional a Cloudinary)
const actualizarProducto = async (
  id: number,
  datos: ProductoPayload,
): Promise<Producto> => {
  const formData = new FormData();
  formData.append("nombre", datos.nombre);
  formData.append("precio_venta", String(datos.precioVenta));
  formData.append("stock", String(datos.stock));

  if (datos.id_categoria) {
    formData.append("id_categoria", String(datos.id_categoria));
  }
  if (datos.imagen) {
    formData.append("imagen", datos.imagen);
  }

  const { data } = await api.put<ProductoBackend>(`/productos/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const categorias = obtenerCategoriasCache();
  const categoriasMap = new Map(categorias.map((c) => [c.id, c.nombre]));
  return mapearProducto(data, categoriasMap);
};

// DELETE
const eliminarProducto = async (id: number): Promise<boolean> => {
  await api.delete(`/productos/${id}`);
  return true;
};

export const ProductoService = {
  listarProductos,
  obtenerProductosAPI,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};