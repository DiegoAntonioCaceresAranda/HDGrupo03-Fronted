import type { FC, ReactElement } from "react";
import { AlertCircle } from "lucide-react";
import StatusIndicador from "../../../components/ui/StatusIndicador";
import type { AttentionOrder } from "../types";

interface ListaOrdenesProps {
  orders: AttentionOrder[];
}

const ListaOrdenes: FC<ListaOrdenesProps> = ({ orders }): ReactElement => (
  <div className="admin-card rounded-4 border h-100 d-flex flex-column">
    <div className="p-4 border-bottom d-flex align-items-center gap-2">
      <AlertCircle size={20} color="var(--admin-primary)" />
      <h3 style={{ fontFamily: "var(--admin-font-display)", fontSize: 20, fontWeight: 600, color: "var(--admin-on-surface)" }}>
        Pedidos que requieren atención
      </h3>
    </div>

    {orders.length === 0 ? (
      <p className="p-4 mb-0" style={{ color: "var(--admin-on-surface-variant)", fontSize: 14 }}>
        No hay pedidos pendientes por ahora. 
      </p>
    ) : (
      <ul className="list-unstyled mb-0">
        {orders.map((order) => (
          <li
            key={order.orderId}
            className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom"
            style={{ borderColor: "var(--admin-surface-container-low)" }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-on-surface)" }}>{order.orderId}</div>
              <div style={{ fontSize: 13, color: "var(--admin-on-surface-variant)" }}>{order.customerName}</div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <StatusIndicador label={order.reason} tone={order.reason === "Pago pendiente" ? "error" : "pendiente"} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--admin-on-surface)" }}>{order.amount}</span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ListaOrdenes;
