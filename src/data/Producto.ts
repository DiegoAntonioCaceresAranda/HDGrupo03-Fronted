export interface Producto {
    id: number;
    codigo: string;
    nombre: string;  
    categoria: string;
    id_categoria?: number | null;
    stock: number;
    precioVenta: number;
    image_url?: string | null;
    image_public_id?: string | null;
}

const productosMock: Producto[] = [
    { id: 1, codigo: 'PROD-001', nombre: 'Café Capuchino', categoria: 'Bebidas Calientes', id_categoria: 1, stock: 20, precioVenta: 6.50, image_url: null},
    { id: 2, codigo: 'PROD-002', nombre: 'Muffin de Arándanos', categoria: 'Postres', id_categoria: 3, stock: 10, precioVenta: 4.80, image_url: null},
    { id: 3, codigo: 'PROD-003', nombre: 'Frappuccino Mocha', categoria: 'Bebidas Frías', id_categoria: 2, stock: 15, precioVenta: 12.50, image_url: null},
];

export default productosMock;