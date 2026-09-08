import productosMock from '../data/Producto';

// memoria para simular la base de datos temporalmente
let productos = [...productosMock];

export const ProductoService = {
  
  // = findAll()
  obtenerTodos: () => {
    return productos;
  },

  // = save()
  agregar: (nuevoProducto: any) => {
    productos = [...productos, nuevoProducto];
    return productos;
  },

  // = deleteById()
  eliminar: (id: number) => {
    productos = productos.filter(prod => prod.id !== id);
    return productos;
  }
};