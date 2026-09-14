import type { FC, ReactElement } from "react";
import { Minus, Plus, X } from "lucide-react";
import { formatoMoneda } from "../../dashboard/utils/dashboardMetrics";
import type { ItemCarrito } from "../types";

interface CartItemRowProps {
  articulo: ItemCarrito;
  onActualizarCantidad: (productoId: number, delta: number) => void;
  onEliminar: (productoId: number) => void;
}

const CartItemRow: FC<CartItemRowProps> = ({ articulo, onActualizarCantidad, onEliminar }): ReactElement => (
  <div
    className="d-flex align-items-start justify-content-between gap-2 p-3 rounded-3"
    style={{ backgroundColor: "var(--admin-surface-container-low)" }}
  >
    <div className="flex-grow-1" style={{ minWidth: 0 }}>
      <div className="d-flex align-items-baseline justify-content-between gap-2">
        <h4 className="mb-0 text-truncate" style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-on-surface)" }}>
          {articulo.nombre}
        </h4>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-primary)" }}>
          {formatoMoneda(articulo.precioUnitario * articulo.cantidad)}
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 mt-2">
        <div
          className="d-flex align-items-center gap-1 rounded-2 px-1"
          style={{ backgroundColor: "var(--admin-surface)", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
        >
          <button
            type="button"
            onClick={() => onActualizarCantidad(articulo.productoId, -1)}
            className="btn p-1 d-flex align-items-center justify-content-center"
            style={{ color: "var(--admin-on-surface-variant)" }}
          >
            <Minus size={14} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--admin-on-surface)", minWidth: 16, textAlign: "center" }}>
            {articulo.cantidad}
          </span>
          <button
            type="button"
            onClick={() => onActualizarCantidad(articulo.productoId, 1)}
            className="btn p-1 d-flex align-items-center justify-content-center"
            style={{ color: "var(--admin-on-surface-variant)" }}
          >
            <Plus size={14} />
          </button>
        </div>
        <span style={{ fontSize: 11, color: "var(--admin-on-surface-variant)" }}>
          {formatoMoneda(articulo.precioUnitario)} c/u
        </span>
      </div>
    </div>

    <button
      type="button"
      onClick={() => onEliminar(articulo.productoId)}
      className="btn p-1"
      style={{ color: "var(--admin-on-surface-variant)" }}
      aria-label={`Quitar ${articulo.nombre}`}
    >
      <X size={16} />
    </button>
  </div>
);

export default CartItemRow;
