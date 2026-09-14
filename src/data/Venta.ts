export interface ItemVenta {
    productoId: number;
    nombre: string;
    precioUnitario: number;
    cantidad: number;
}

export type TipoOrden = "En Local" | "Para Llevar" | "Delivery";

export type MetodoPago = "Efectivo" | "Tarjeta" | "QR / Transferencia";

export interface Venta {
    id: number;
    ticket: string;
    fecha: string;
    tipoOrden: TipoOrden;
    ubicacion?: string;
    cliente?: string;
    metodoPago: MetodoPago;
    items: ItemVenta[];
    subtotal: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    impuesto: number;
    total: number;
}

const ventasMock: Venta[] = [];

export default ventasMock;
