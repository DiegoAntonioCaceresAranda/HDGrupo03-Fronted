import categoriesMock, { type Categoria } from "../data/Categoria";

const StorageKey = "categorias";

const inicializarCategorias = () => {
    const categoriasGuardadas = localStorage.getItem(StorageKey);

    if (!categoriasGuardadas) {
        localStorage.setItem(StorageKey, JSON.stringify(categoriesMock));
    }
};

const obtenerCategorias = (): Categoria[] => {
    inicializarCategorias();

    const data = localStorage.getItem(StorageKey);
    return data ? JSON.parse(data) : [];
}

const guardarCategorias = (categorias: Categoria[]): void => {
    localStorage.setItem(StorageKey, JSON.stringify(categorias));
};

//CREATE
const crearCategoria = (categoria: Omit<Categoria, "id">): Categoria => {
    const categorias = obtenerCategorias();
    const nuevoId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
    const nuevaCategoria: Categoria = {id: nuevoId, ...categoria};
    
    guardarCategorias([...categorias,nuevaCategoria]);
    return nuevaCategoria;
};

//READ
const listarCategorias = (): Categoria[] => {
    return obtenerCategorias();
};

//UPDATE
const actualizarCategoria = (id: number, datos: Omit<Categoria, "id">): Categoria | null => {
    const categorias = obtenerCategorias();
    const categoriaExiste = categorias.find(categorias => categorias.id === id);

    if (!categoriaExiste) {
        return null;
    }

    const categoriaActualizada = categorias.map(
        categorias => categorias.id == id
         ? {
            id,
            ...datos
         }
         :categorias
    );

    guardarCategorias(categoriaActualizada);
    return categoriaActualizada.find(categorias => categorias.id === id) || null;
};

//DELETE
const eliminarCategoria = (id: number): boolean => {
    const categorias = obtenerCategorias();
    const categoriasFiltradas = categorias.filter(categorias => categorias.id !== id);

    if (categoriasFiltradas.length === categorias.length) {
        return false;
    }

    guardarCategorias(categoriasFiltradas);
    return true;
};

export const catergoriaService = {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};