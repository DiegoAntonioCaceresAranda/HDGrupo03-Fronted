import api from "../config/axios";
import { type Categoria } from "../data/Categoria";

// Lo que devuelve FastAPI
interface CategoriaApi {
  id_categoria?: number;
  id?: number;
  nombre: string;
}

// Convierte a la forma que ya usa tu frontend: { id, nombre }
const aCategoria = (c: CategoriaApi): Categoria =>
  ({
    id: c.id_categoria ?? c.id,
    nombre: c.nombre,
  }) as Categoria;

// READ
const listarCategorias = async (): Promise<Categoria[]> => {
  const { data } = await api.get<CategoriaApi[]>("/categorias/");
  return data.map(aCategoria);
};

// CREATE
const crearCategoria = async (
  categoria: Omit<Categoria, "id">,
): Promise<Categoria> => {
  const { data } = await api.post<CategoriaApi>("/categorias/", categoria);
  return aCategoria(data);
};

// UPDATE
const actualizarCategoria = async (
  id: number,
  datos: Omit<Categoria, "id">,
): Promise<Categoria> => {
  const { data } = await api.put<CategoriaApi>(`/categorias/${id}`, datos);
  return aCategoria(data);
};

// DELETE
const eliminarCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};

// Mantengo el nombre "catergoriaService" (con el typo) para no romper tus imports
export const catergoriaService = {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};