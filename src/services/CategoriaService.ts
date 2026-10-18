import api from "../config/axios";
import categoriesMock, { type Categoria } from "../data/Categoria";

const StorageKey = "categorias";

interface CategoriaBackend {
  id_categoria: number;
  nombre: string;
}

const mapearCategoria = (c: CategoriaBackend): Categoria => ({
  id: c.id_categoria,
  nombre: c.nombre,
});

export const obtenerCategoriasCache = (): Categoria[] => {
  const data = localStorage.getItem(StorageKey);
  return data ? JSON.parse(data) : categoriesMock;
};

// READ (Desde FastAPI / Supabase)
const listarCategorias = async (): Promise<Categoria[]> => {
  try {
    const { data } = await api.get<CategoriaBackend[]>("/categorias/");
    const categorias = data.map(mapearCategoria);
    localStorage.setItem(StorageKey, JSON.stringify(categorias));
    return categorias;
  } catch (error) {
    console.error("Error al listar categorías desde el backend:", error);
    return obtenerCategoriasCache();
  }
};

// CREATE
const crearCategoria = async (
  categoria: Omit<Categoria, "id">,
): Promise<Categoria> => {
  const { data } = await api.post<CategoriaBackend>("/categorias/", {
    nombre: categoria.nombre,
  });
  const nueva = mapearCategoria(data);
  const actuales = obtenerCategoriasCache();
  localStorage.setItem(StorageKey, JSON.stringify([...actuales, nueva]));
  return nueva;
};

// UPDATE
const actualizarCategoria = async (
  id: number,
  datos: Omit<Categoria, "id">,
): Promise<Categoria | null> => {
  const { data } = await api.put<CategoriaBackend>(`/categorias/${id}`, {
    nombre: datos.nombre,
  });
  return mapearCategoria(data);
};

// DELETE
const eliminarCategoria = async (id: number): Promise<boolean> => {
  await api.delete(`/categorias/${id}`);
  return true;
};


export const catergoriaService = {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};