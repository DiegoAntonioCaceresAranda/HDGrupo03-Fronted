import productosMock, { type Producto } from "../data/Producto";

const STORAGE_KEY = "productos";

// Inicializar productos
const inicializarProductos = (): void => {
    const productosGuardados = localStorage.getItem(STORAGE_KEY);

    if (!productosGuardados) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(productosMock)
        );
    }
};

// Obtener productos
const obtenerProductos = (): Producto[] => {
    inicializarProductos();

    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
};

// Guardar productos
const guardarProductos = (productos: Producto[]): void => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(productos)
    );
};

// CREATE
const crearProducto = (
    producto: Omit<Producto, "id">
): Producto => {

    const productos = obtenerProductos();
    const nuevoId =
        productos.length > 0
            ? Math.max(...productos.map(p => p.id)) + 1
            : 1;
    const nuevoProducto: Producto = {
        id: nuevoId,
        ...producto
    };

    guardarProductos([
        ...productos,
        nuevoProducto
    ]);
    return nuevoProducto;
};

// READ
const listarProductos = (): Producto[] => {
    return obtenerProductos();
};

// UPDATE
const actualizarProducto = (
    id: number,
    datos: Omit<Producto, "id">
): Producto | null => {
    const productos = obtenerProductos();
    const productoExiste = productos.find(
        producto => producto.id === id
    );

    if (!productoExiste) {
        return null;
    }

    const productosActualizados = productos.map(
        producto =>
            producto.id === id
                ? {
                    id,
                    ...datos
                }
                : producto
    );

    guardarProductos(productosActualizados);
    return (
        productosActualizados.find(
            producto => producto.id === id
        ) || null
    );
};

// DELETE
const eliminarProducto = (id: number): boolean => {
    const productos = obtenerProductos();
    const productosFiltrados = productos.filter(
        producto => producto.id !== id
    );

    if (productosFiltrados.length === productos.length) {
        return false;
    }
    guardarProductos(productosFiltrados);

    return true;
};

export const productoService = {
    listarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};