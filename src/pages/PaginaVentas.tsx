import { useState, type FC, type ReactElement } from "react";
import AdminLayout from "../components/AdminLayout";
import OrderTypeToggle from "../features/ventas/components/OrderTypeToggle";
import ProductToolbar from "../features/ventas/components/ProductToolbar";
import CategoryPills from "../features/ventas/components/CategoryPills";
import ProductGrid from "../features/ventas/components/ProductGrid";
import CartPanel from "../features/ventas/components/CartPanel";
import SaleToast from "../features/ventas/components/SaleToast";
import { useProductosPOS } from "../features/ventas/hooks/useProductosPOS";
import { useCarrito } from "../features/ventas/hooks/useCarrito";
import { VentaService } from "../services/VentaService";
import type { MetodoPago, TipoOrden } from "../features/ventas/types";
import "../styles/pos.css";

interface ToastState {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tono: "exito" | "error";
}

const PaginaVentas: FC = (): ReactElement => {
  const {
    productosFiltrados,
    categorias,
    categoriaActiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    refrescar,
  } = useProductosPOS();

  const {
    articulos,
    resumen,
    descuentoPorcentaje,
    error: errorCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarArticulo,
    aplicarDescuento,
    limpiarCarrito,
  } = useCarrito();

  const [tipoOrden, setTipoOrden] = useState<TipoOrden>("En Local");
  const [ubicacion, setUbicacion] = useState("");
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("Efectivo");
  const [procesando, setProcesando] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, titulo: "", mensaje: "", tono: "exito" });

  const mostrarToast = (titulo: string, mensaje: string, tono: "exito" | "error" = "exito") => {
    setToast({ visible: true, titulo, mensaje, tono });
    setTimeout(() => setToast((anterior) => ({ ...anterior, visible: false })), 3200);
  };

  const handleCompletarVenta = () => {
    setProcesando(true);
    try {
      const venta = VentaService.registrarVenta({
        tipoOrden,
        ubicacion: ubicacion || undefined,
        cliente: cliente || undefined,
        metodoPago,
        items: articulos.map((articulo) => ({
          productoId: articulo.productoId,
          nombre: articulo.nombre,
          precioUnitario: articulo.precioUnitario,
          cantidad: articulo.cantidad,
        })),
        subtotal: resumen.subtotal,
        descuentoPorcentaje: resumen.descuentoPorcentaje,
        descuentoMonto: resumen.descuentoMonto,
        impuesto: resumen.impuesto,
        total: resumen.total,
      });

      mostrarToast("Venta Completada", `Ticket #${venta.ticket} registrado y stock actualizado.`);
      limpiarCarrito();
      setUbicacion("");
      setCliente("");
      refrescar();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Intenta nuevamente en unos segundos.";
      mostrarToast("No se pudo completar la venta", mensaje, "error");
    } finally {
      setProcesando(false);
    }
  };

  const handleGuardarPendiente = () => {
    mostrarToast("Orden en Espera", "El ticket se guardó en pedidos pendientes.");
  };

  const handleAbrirDescuento = () => {
    aplicarDescuento(descuentoPorcentaje > 0 ? 0 : 10);
  };

  return (
    <AdminLayout activePath="/admin/ventas">
      <div className="admin-page">
        <div className="d-flex flex-column flex-lg-row gap-4">
          <section className="flex-grow-1 d-flex flex-column gap-4" style={{ minWidth: 0 }}>
            <div className="admin-card rounded-4 p-4 border d-flex flex-column flex-sm-row justify-content-between gap-3">
              <div>
                <span className="text-uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "var(--admin-primary)" }}>
                  Terminal Activa • Caja Principal
                </span>
                <h1 className="mb-0 mt-1" style={{ fontFamily: "var(--admin-font-display)", fontSize: 32, fontWeight: 700, color: "var(--admin-primary)" }}>
                  Punto de Venta
                </h1>
                <p className="mb-0 mt-1" style={{ fontSize: 14, color: "var(--admin-on-surface-variant)" }}>
                  Selecciona productos del catálogo para registrar una orden. El stock se descuenta automáticamente al cobrar.
                </p>
              </div>
              <OrderTypeToggle valor={tipoOrden} alCambiar={setTipoOrden} />
            </div>

            <div className="d-flex flex-column gap-3">
              <ProductToolbar
                busqueda={busqueda}
                onBuscar={setBusqueda}
                descuentoActivo={descuentoPorcentaje > 0}
                onAbrirDescuento={handleAbrirDescuento}
              />
              <CategoryPills categorias={categorias} activa={categoriaActiva} alCambiar={setCategoriaActiva} />
            </div>

            <ProductGrid productos={productosFiltrados} onAgregar={agregarProducto} />
          </section>

          <aside className="w-100" style={{ maxWidth: 380 }}>
            <div style={{ position: "sticky", top: 88 }}>
              <CartPanel
                tipoOrden={tipoOrden}
                ubicacion={ubicacion}
                onUbicacionChange={setUbicacion}
                cliente={cliente}
                onClienteChange={setCliente}
                articulos={articulos}
                onActualizarCantidad={actualizarCantidad}
                onEliminarArticulo={eliminarArticulo}
                onLimpiar={limpiarCarrito}
                resumen={resumen}
                errorCarrito={errorCarrito}
                metodoPago={metodoPago}
                onMetodoPagoChange={setMetodoPago}
                onCompletarVenta={handleCompletarVenta}
                onGuardarPendiente={handleGuardarPendiente}
                procesando={procesando}
              />
            </div>
          </aside>
        </div>
      </div>

      <SaleToast visible={toast.visible} titulo={toast.titulo} mensaje={toast.mensaje} tono={toast.tono} />
    </AdminLayout>
  );
};

export default PaginaVentas;
