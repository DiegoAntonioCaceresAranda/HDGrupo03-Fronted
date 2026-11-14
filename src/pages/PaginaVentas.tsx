import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type ReactElement,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderTypeToggle from "../features/ventas/components/OrderTypeToggle";
import ProductToolbar from "../features/ventas/components/ProductToolbar";
import CategoryPills from "../features/ventas/components/CategoryPills";
import ProductGrid from "../features/ventas/components/ProductGrid";
import CartPanel from "../features/ventas/components/CartPanel";
import SaleToast from "../features/ventas/components/SaleToast";
import { useProductosPOS } from "../features/ventas/hooks/useProductosPOS";
import { useCarrito } from "../features/ventas/hooks/useCarrito";
import { VentaService, type DatosVenta } from "../services/VentaService";
import type { Venta } from "../data/Venta";
import type {
  ItemCarrito,
  MetodoPago,
  TipoOrden,
} from "../features/ventas/types";
import "../styles/pos.css";

interface ToastState {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tono: "exito" | "error";
}

const estiloBotonPendientes = {
  "--bs-btn-color": "var(--admin-primary)",
  "--bs-btn-bg": "#f1e4d1",
  "--bs-btn-border-color": "#e0cbb0",
  "--bs-btn-hover-color": "var(--admin-primary)",
  "--bs-btn-hover-bg": "#e3cfb2",
  "--bs-btn-hover-border-color": "#d3b992",
  "--bs-btn-active-color": "var(--admin-primary)",
  "--bs-btn-active-bg": "#d9c0a0",
  "--bs-btn-active-border-color": "#c9ab85",
  fontSize: 13,
} as CSSProperties;

const PaginaVentas: FC = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const pendienteEntrante = (location.state as { pendiente?: Venta } | null)
    ?.pendiente;

  const {
    productos,
    productosFiltrados,
    categorias,
    nombresCategorias,
    categoriaActiva,
    setCategoriaActiva,
    busqueda,
    setBusqueda,
    refrescar,
    cargando,
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
    cargarArticulos,
  } = useCarrito();

  const [tipoOrden, setTipoOrden] = useState<TipoOrden>("En Local");
  const [ubicacion, setUbicacion] = useState("");
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("Efectivo");
  const [procesando, setProcesando] = useState(false);
  // Id del pendiente que se está retomando (null si es una venta nueva)
  const [pendienteActivoId, setPendienteActivoId] = useState<number | null>(
    null,
  );
  const pendienteCargado = useRef(false);

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    titulo: "",
    mensaje: "",
    tono: "exito",
  });

  const mostrarToast = (
    titulo: string,
    mensaje: string,
    tono: "exito" | "error" = "exito",
  ) => {
    setToast({ visible: true, titulo, mensaje, tono });
  };

  // Carga el pendiente elegido en la otra pantalla dentro del ticket
  useEffect(() => {
    if (!pendienteEntrante || cargando || pendienteCargado.current) return;
    pendienteCargado.current = true;

    const cargados: ItemCarrito[] = [];
    const avisos: string[] = [];

    pendienteEntrante.items.forEach((item) => {
      const prod = productos.find((p) => p.id_producto === item.productoId);
      if (!prod || prod.stock <= 0) {
        avisos.push(`"${item.nombre}" sin stock, se omitió`);
        return;
      }
      const cantidad = Math.min(item.cantidad, prod.stock);
      if (cantidad < item.cantidad) {
        avisos.push(`"${item.nombre}" se ajustó a ${cantidad} uds.`);
      }
      cargados.push({
        productoId: prod.id_producto,
        nombre: prod.nombre,
        precioUnitario: Number(prod.precio_venta),
        cantidad,
        stockDisponible: prod.stock,
      });
    });

    cargarArticulos(cargados, pendienteEntrante.descuentoPorcentaje ?? 0);
    setTipoOrden(pendienteEntrante.tipoOrden);
    setUbicacion(pendienteEntrante.ubicacion ?? "");
    setCliente(pendienteEntrante.cliente ?? "");
    setMetodoPago(pendienteEntrante.metodoPago);
    setPendienteActivoId(pendienteEntrante.id);

    if (avisos.length > 0) {
      mostrarToast("Pedido retomado con ajustes", avisos.join(". ") + ".");
    } else {
      mostrarToast(
        "Pedido retomado",
        `Ticket #${pendienteEntrante.ticket} cargado. Puedes editarlo y cobrarlo.`,
      );
    }

    // Limpia el state de la navegación para que un F5 no lo vuelva a cargar
    navigate(location.pathname, { replace: true, state: null });
  }, [pendienteEntrante, cargando]);

  const armarDatosVenta = (): DatosVenta => ({
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
    pendienteId: pendienteActivoId ?? undefined,
  });

  const reiniciarTicket = () => {
    limpiarCarrito();
    setUbicacion("");
    setCliente("");
    setPendienteActivoId(null);
  };

  const mensajeDeError = (error: unknown) =>
    error instanceof Error
      ? error.message
      : "Intenta nuevamente en unos segundos.";

  const handleCompletarVenta = async () => {
    setProcesando(true);

    try {
      const venta = await VentaService.registrarVenta(armarDatosVenta());

      mostrarToast(
        "Venta Completada",
        `Ticket #${venta.ticket} registrado y stock actualizado.`,
      );

      reiniciarTicket();
      await refrescar();
    } catch (error) {
      mostrarToast(
        "No se pudo completar la venta",
        mensajeDeError(error),
        "error",
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleGuardarPendiente = async () => {
    setProcesando(true);

    try {
      const venta = await VentaService.guardarPendiente(armarDatosVenta());

      mostrarToast(
        "Orden en Espera",
        `Ticket #${venta.ticket} guardado en pedidos pendientes.`,
      );

      reiniciarTicket();
    } catch (error) {
      mostrarToast(
        "No se pudo guardar el pendiente",
        mensajeDeError(error),
        "error",
      );
    } finally {
      setProcesando(false);
    }
  };

  const handleAbrirDescuento = () => {
    aplicarDescuento(descuentoPorcentaje > 0 ? 0 : 10);
  };

  return (
    <>
      <div className="admin-page">
        <div className="d-flex flex-column flex-lg-row gap-4 align-items-start">
          <section
            className="d-flex flex-column gap-4"
            style={{ flex: "1 1 0", minWidth: 0, width: "100%" }}
          >
            <div className="admin-card rounded-4 p-4 border d-flex flex-column flex-sm-row justify-content-between gap-3">
              <div>
                <span
                  className="text-uppercase"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    color: "var(--admin-primary)",
                  }}
                >
                  Terminal Activa • Caja Principal
                </span>

                <h1
                  className="mb-0 mt-1"
                  style={{
                    fontFamily: "var(--admin-font-display)",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "var(--admin-primary)",
                  }}
                >
                  Punto de Venta
                </h1>

                <p
                  className="mb-0 mt-1"
                  style={{
                    fontSize: 14,
                    color: "var(--admin-on-surface-variant)",
                  }}
                >
                  Selecciona productos del catálogo para registrar una orden. El
                  stock se descuenta automáticamente al cobrar.
                </p>
              </div>

              <div className="d-flex flex-column justify-content-between align-items-stretch align-items-sm-end gap-4">
                <OrderTypeToggle valor={tipoOrden} alCambiar={setTipoOrden} />

                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-3 py-2 fw-semibold shadow-sm"
                  style={estiloBotonPendientes}
                  onClick={() => navigate("/admin/ventas/pendientes")}
                >
                  🕒 Ver ventas pendientes
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              <ProductToolbar
                busqueda={busqueda}
                onBuscar={setBusqueda}
                descuentoActivo={descuentoPorcentaje > 0}
                onAbrirDescuento={handleAbrirDescuento}
              />

              <CategoryPills
                categorias={categorias}
                activa={categoriaActiva}
                alCambiar={setCategoriaActiva}
              />
            </div>

            <ProductGrid
              productos={productosFiltrados}
              nombresCategorias={nombresCategorias}
              onAgregar={agregarProducto}
            />
          </section>

          <aside
            className="pos-cart-panel"
            style={{
              flex: "0 0 34%",
              width: "100%",
              minWidth: 0,
              maxWidth: "none",
            }}
          >
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
                onLimpiar={reiniciarTicket}
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

      <SaleToast
        visible={toast.visible}
        titulo={toast.titulo}
        mensaje={toast.mensaje}
        tono={toast.tono}
      />
    </>
  );
};

export default PaginaVentas;