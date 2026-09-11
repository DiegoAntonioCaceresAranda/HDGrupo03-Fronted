import ventasMock, { type Venta } from "../data/Venta";
import { ProductoService } from "./ProductoService";

const STORAGE_KEY = "ventas";
const CORRELATIVO_KEY = "ventas_correlativo";

const inicializarVentas = (): void => {
    const ventasGuardadas = localStorage.getItem(STORAGE_KEY);

    if (!ventasGuardadas) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ventasMock));
    }
};

const obtenerVentas = (): Venta[] => {
    inicializarVentas();

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const guardarVentas = (ventas: Venta[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ventas));
};

const siguienteTicket = (): string => {
    const actual = Number(localStorage.getItem(CORRELATIVO_KEY) ?? "1000");
    const siguiente = actual + 1;
    localStorage.setItem(CORRELATIVO_KEY, String(siguiente));
    return String(siguiente);
};

const listarVentas = (): Venta[] => {
    return obtenerVentas();
};

const registrarVenta = (
    datos: Omit<Venta, "id" | "ticket" | "fecha">
): Venta => {
    const productos = ProductoService.listarProductos();

    for (const item of datos.items) {
        const producto = productos.find((p) => p.id === item.productoId);
        if (!producto) {
            throw new Error(`El producto "${item.nombre}" ya no existe en el catálogo.`);
        }
        if (producto.stock < item.cantidad) {
            throw new Error(`Stock insuficiente de "${producto.nombre}" (disponible: ${producto.stock}).`);
        }
    }

    datos.items.forEach((item) => {
        const producto = productos.find((p) => p.id === item.productoId);
        if (producto) {
            ProductoService.actualizarProducto(producto.id, {
                ...producto,
                stock: producto.stock - item.cantidad,
            });
        }
    });

    const ventas = obtenerVentas();
    const nuevoId = ventas.length > 0 ? Math.max(...ventas.map((v) => v.id)) + 1 : 1;

    const nuevaVenta: Venta = {
        id: nuevoId,
        ticket: siguienteTicket(),
        fecha: new Date().toISOString(),
        ...datos,
    };

    guardarVentas([...ventas, nuevaVenta]);
    return nuevaVenta;
};

export const VentaService = {
    listarVentas,
    registrarVenta,
};
