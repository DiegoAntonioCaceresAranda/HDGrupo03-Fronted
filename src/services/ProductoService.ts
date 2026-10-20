import api from "../config/axios";

// Forma real de lo que devuelve tu FastAPI
export interface Producto {
  id_producto: number;
  codigo: string;
  nombre: string;
  precio_venta: number;
  stock: number;
  id_categoria: number | null;
  image_url: string | null;
  image_public_id: string | null;
}

// Datos que envía el formulario
export interface ProductoForm {
  nombre: string;
  precio_venta: number;
  stock?: number;
  id_categoria?: number | null;
  imagen?: File | null;
}

// Tu backend usa Form(...) y File(...), por eso se envía FormData
const construirFormData = (datos: Partial<ProductoForm>): FormData => {
  const fd = new FormData();
  Object.entries(datos).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null || valor === "") return;
    fd.append(clave, valor instanceof File ? valor : String(valor));
  });
  return fd;
};

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

// READ
const listarProductos = async (): Promise<Producto[]> => {
  const { data } = await api.get<Producto[]>("/productos/");
  return data;
};

// CREATE
const crearProducto = async (datos: ProductoForm): Promise<Producto> => {
  const { data } = await api.post<Producto>(
    "/productos/",
    construirFormData(datos),
    multipart
  );
  return data;
};

// UPDATE
const actualizarProducto = async (
  id: number,
  datos: Partial<ProductoForm>
): Promise<Producto> => {
  const { data } = await api.put<Producto>(
    `/productos/${id}`,
    construirFormData(datos),
    multipart
  );
  return data;
};

// DELETE
const eliminarProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};

export const ProductoService = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};