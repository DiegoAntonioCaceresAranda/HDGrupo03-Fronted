import type { FC, ReactElement } from "react";
import { Tag } from "lucide-react";
import { formatoMoneda } from "../../dashboard/utils/dashboardMetrics";
import type { ResumenTicket } from "../types";

interface CartSummaryProps {
  resumen: ResumenTicket;
}

const filaStyle = { fontSize: 14, color: "var(--admin-on-surface-variant)" };

const CartSummary: FC<CartSummaryProps> = ({ resumen }): ReactElement => (
  <div className="d-flex flex-column gap-2 p-3 rounded-3" style={{ backgroundColor: "var(--admin-surface-container-low)" }}>
    <div className="d-flex justify-content-between" style={filaStyle}>
      <span>Subtotal</span>
      <span style={{ fontWeight: 600, color: "var(--admin-on-surface)" }}>{formatoMoneda(resumen.subtotal)}</span>
    </div>

    {resumen.descuentoPorcentaje > 0 && (
      <div className="d-flex justify-content-between" style={{ ...filaStyle, color: "var(--admin-primary)" }}>
        <span className="d-flex align-items-center gap-1">
          <Tag size={14} />
          Descuento ({resumen.descuentoPorcentaje}%)
        </span>
        <span style={{ fontWeight: 600 }}>-{formatoMoneda(resumen.descuentoMonto)}</span>
      </div>
    )}

    <div className="d-flex justify-content-between" style={filaStyle}>
      <span>Impuesto</span>
      <span style={{ fontWeight: 600, color: "var(--admin-on-surface)" }}>{formatoMoneda(resumen.impuesto)}</span>
    </div>

    <hr className="my-1" style={{ borderColor: "var(--admin-outline-variant)", opacity: 0.4 }} />

    <div className="d-flex align-items-baseline justify-content-between pt-1">
      <span style={{ fontFamily: "var(--admin-font-display)", fontSize: 18, fontWeight: 700, color: "var(--admin-primary)" }}>
        Total a Pagar
      </span>
      <span style={{ fontFamily: "var(--admin-font-display)", fontSize: 28, fontWeight: 700, color: "var(--admin-primary)" }}>
        {formatoMoneda(resumen.total)}
      </span>
    </div>
  </div>
);

export default CartSummary;
