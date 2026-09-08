import type { FC, ReactElement } from "react";
import { MoreVertical } from "lucide-react";
import StatusIndicador from "../../../components/ui/StatusIndicador";
import { useAdminPagination } from "../../../hooks/useAdminPagination";
import type { Transaccion } from "../types";

interface TransaccionesDiariasTablaProps {
  transacciones: Transaccion[];
}

const columns = ["Hora", "Order ID", "Artículos", "Status", "Monto"] as const;

const TransaccionDiariaTabla: FC<TransaccionesDiariasTablaProps> = ({ transacciones }): ReactElement => {
  const { visibleItems, hasMore, loadMore } = useAdminPagination(transacciones, 10);

  return (
    <div className="admin-card rounded-4 border overflow-hidden">
      <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
        <h3 style={{ fontFamily: "var(--admin-font-display)", fontSize: 24, fontWeight: 600, color: "var(--admin-on-surface)" }}>
          Transacciones Diarias
        </h3>
        <button className="btn admin-icon-btn rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="table-responsive">
        <table className="table mb-0 table-hover align-middle">
          <thead>
            <tr style={{ backgroundColor: "var(--admin-surface-container-low)" }}>
              {columns.map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-4 text-uppercase ${i === columns.length - 1 ? "text-end" : ""}`}
                  style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: "var(--admin-on-surface-variant)", border: "none" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((t) => (
              <tr key={t.ordenId}>
                <td className="py-3 px-4 text-nowrap" style={{ fontSize: 14, border: "none" }}>{t.tiempo}</td>
                <td className="py-3 px-4" style={{ fontSize: 14, fontFamily: "monospace", border: "none" }}>{t.ordenId}</td>
                <td className="py-3 px-4" style={{ fontSize: 14, border: "none" }}>{t.items}</td>
                <td className="py-3 px-4 text-nowrap" style={{ border: "none" }}>
                  <StatusIndicador label={t.estado} tone={t.estado === "Completado" ? "exito" : "pendiente"} />
                </td>
                <td className="py-3 px-4 text-end" style={{ fontSize: 16, fontWeight: 600, border: "none" }}>{t.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-3 border-top d-flex justify-content-center">
          <button
            onClick={loadMore}
            className="btn admin-load-more px-4 py-2 rounded-3 border"
            style={{ color: "var(--admin-primary)", borderColor: "var(--admin-outline-variant)", fontSize: 14, fontWeight: 600 }}
          >
            Cargar más transacciones
          </button>
        </div>
      )}
    </div>
  );
};

export default TransaccionDiariaTabla;
