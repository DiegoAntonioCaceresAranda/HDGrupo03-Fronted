export interface Producto {
    id: number;
    codigo: string;
    nombre: string;  
    categoria: string;
    stock: number;
    precioVenta: number;
}

const productosMock: Producto[] = [
    { id: 1, codigo: 'COD-001', nombre: 'Café Capuchino', categoria: 'Bebidas Calientes', stock: 20, precioVenta: 6.50 },
    { id: 2, codigo: 'COD-002', nombre: 'Muffin de Arándanos', categoria: 'Postres', stock: 10, precioVenta: 4.80},
    { id: 3, codigo: 'COD-003', nombre: 'Frappuccino Mocha', categoria: 'Bebidas Frías', stock: 15, precioVenta: 12.50}

];

export default productosMock;