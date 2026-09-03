import type { FC, ReactElement } from "react";
import { PackageX } from "lucide-react";
import type { LowStockProduct } from "../types";

interface AlertaStockProps {
  products: LowStockProduct[];
}

const AlertaStock: FC<AlertaStockProps> = ({ products }): ReactElement => (
  <div className="admin-card rounded-4 border h-100 d-flex flex-column">
    <div className="p-4 border-bottom d-flex align-items-center gap-2">
      <PackageX size={20} color="var(--admin-primary)" />
      <h3 style={{ fontFamily: "var(--admin-font-display)", fontSize: 20, fontWeight: 600, color: "var(--admin-on-surface)" }}>
        Stock bajo
      </h3>
    </div>

    {products.length === 0 ? (
      <p className="p-4 mb-0" style={{ color: "var(--admin-on-surface-variant)", fontSize: 14 }}>
        Todo el inventario está en niveles saludables.
      </p>
    ) : (
      <ul className="list-unstyled mb-0">
        {products.map((p) => (
          <li
            key={p.productId}
            className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom"
            style={{ borderColor: "var(--admin-surface-container-low)" }}
          >
            <span style={{ fontSize: 14, color: "var(--admin-on-surface)" }}>{p.name}</span>
            <span
              className="badge rounded-pill fw-bold"
              style={{ backgroundColor: "#fdecea", color: "#b3261e", fontSize: 12 }}
            >
              quedan {p.stock}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default AlertaStock;
