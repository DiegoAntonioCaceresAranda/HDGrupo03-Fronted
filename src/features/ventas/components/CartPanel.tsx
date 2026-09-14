import type { FC, ReactElement } from "react";
import { Trash2, Bookmark, Ban, ShoppingCart, AlertTriangle } from "lucide-react";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import PaymentMethodPicker from "./PaymentMethodPicker";
import type { ItemCarrito, MetodoPago, ResumenTicket, TipoOrden } from "../types";

interface CartPanelProps {
  tipoOrden: TipoOrden;
  ubicacion: string;
  onUbicacionChange: (valor: string) => void;
  cliente: string;
  onClienteChange: (valor: string) => void;
  articulos: ItemCarrito[];
  onActualizarCantidad: (productoId: number, delta: number) => void;
  onEliminarArticulo: (productoId: number) => void;
  onLimpiar: () => void;
  resumen: ResumenTicket;
  errorCarrito: string | null;
  metodoPago: MetodoPago;
  onMetodoPagoChange: (metodo: MetodoPago) => void;
  onCompletarVenta: () => void;
  onGuardarPendiente: () => void;
  procesando: boolean;
}

const CartPanel: FC<CartPanelProps> = ({
  tipoOrden,
  ubicacion,
  onUbicacionChange,
  cliente,
  onClienteChange,
  articulos,
  onActualizarCantidad,
  onEliminarArticulo,
  onLimpiar,
  resumen,
  errorCarrito,
  metodoPago,
  onMetodoPagoChange,
  onCompletarVenta,
  onGuardarPendiente,
  procesando,
}): ReactElement => {
  const cantidadTotal = articulos.reduce((acumulado, articulo) => acumulado + articulo.cantidad, 0);

  return (
    <div className="admin-card rounded-4 p-4 border d-flex flex-column gap-4">
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontFamily: "var(--admin-font-display)", fontSize: 22, fontWeight: 700, color: "var(--admin-primary)" }}>
              Ticket Actual
            </span>
            <span className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: "var(--admin-secondary-container)" }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--admin-on-surface-variant)" }}>{tipoOrden}</span>
        </div>
        <button
          type="button"
          onClick={onLimpiar}
          className="btn p-2 rounded-2"
          style={{ color: "var(--admin-on-surface-variant)" }}
          title="Limpiar ticket"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="row g-2">
        <div className="col-6">
          <label className="d-block text-uppercase mb-1" style={{ fontSize: 10, fontWeight: 700, color: "var(--admin-on-surface-variant)" }}>
            Ubicación
          </label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => onUbicacionChange(e.target.value)}
            placeholder="Mesa / Barra"
            className="form-control rounded-2"
            style={{ backgroundColor: "var(--admin-surface-container-low)", border: "none", fontSize: 13 }}
          />
        </div>
        <div className="col-6">
          <label className="d-block text-uppercase mb-1" style={{ fontSize: 10, fontWeight: 700, color: "var(--admin-on-surface-variant)" }}>
            Cliente (opcional)
          </label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => onClienteChange(e.target.value)}
            placeholder="Ej. Carlos M."
            className="form-control rounded-2"
            style={{ backgroundColor: "var(--admin-surface-container-low)", border: "none", fontSize: 13 }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between" style={{ fontSize: 12, color: "var(--admin-on-surface-variant)" }}>
        <span className="text-uppercase" style={{ fontWeight: 700 }}>Artículos ({articulos.length})</span>
        <span>Total {cantidadTotal} uds.</span>
      </div>

      {errorCarrito && (
        <div
          className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
          style={{ backgroundColor: "#fdecea", color: "#b3261e", fontSize: 12, fontWeight: 600 }}
        >
          <AlertTriangle size={16} />
          {errorCarrito}
        </div>
      )}

      <div className="d-flex flex-column gap-2 pos-cart-scroll" style={{ maxHeight: 320, overflowY: "auto" }}>
        {articulos.length === 0 ? (
          <div className="text-center py-4 d-flex flex-column align-items-center gap-2" style={{ color: "var(--admin-on-surface-variant)" }}>
            <ShoppingCart size={28} />
            <span style={{ fontSize: 13 }}>Ticket vacío. Selecciona productos del menú.</span>
          </div>
        ) : (
          articulos.map((articulo) => (
            <CartItemRow
              key={articulo.productoId}
              articulo={articulo}
              onActualizarCantidad={onActualizarCantidad}
              onEliminar={onEliminarArticulo}
            />
          ))
        )}
      </div>

      <CartSummary resumen={resumen} />

      <PaymentMethodPicker valor={metodoPago} alCambiar={onMetodoPagoChange} />

      <div className="d-flex flex-column gap-2">
        <button
          type="button"
          onClick={onCompletarVenta}
          disabled={articulos.length === 0 || procesando}
          className="btn w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2"
          style={{
            backgroundColor: "var(--admin-primary)",
            color: "#ffffff",
            fontFamily: "var(--admin-font-display)",
            fontSize: 16,
            fontWeight: 700,
            opacity: articulos.length === 0 || procesando ? 0.6 : 1,
          }}
        >
          <ShoppingCart size={20} />
          {procesando ? "Procesando..." : "Cobrar y Completar Venta"}
        </button>
        <div className="row row-cols-2 g-2">
          <div className="col">
            <button
              type="button"
              onClick={onGuardarPendiente}
              disabled={articulos.length === 0}
              className="btn w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "var(--admin-surface-container-low)", color: "var(--admin-on-surface-variant)", fontSize: 13, fontWeight: 600 }}
            >
              <Bookmark size={16} />
              Guardar Pendiente
            </button>
          </div>
          <div className="col">
            <button
              type="button"
              onClick={onLimpiar}
              disabled={articulos.length === 0}
              className="btn w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "transparent", color: "var(--admin-on-surface-variant)", fontSize: 13, fontWeight: 600 }}
            >
              <Ban size={16} />
              Cancelar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
