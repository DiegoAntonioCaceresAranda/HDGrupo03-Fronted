import type { FC, ReactElement } from "react";
import { ChevronRight } from "lucide-react";
import type { ProductoDestacado } from "../types";

interface ProductosDestacadosProps {
  products: ProductoDestacado[];
  onViewAll?: () => void;
}

const ProductosDestacados: FC<ProductosDestacadosProps> = ({ products, onViewAll }): ReactElement => (
  <div className="admin-card rounded-4 p-4 border h-100 d-flex flex-column">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 style={{ fontFamily: "var(--admin-font-display)", fontSize: 24, fontWeight: 600, color: "var(--admin-on-surface-variant)" }}>
        Productos Más Vendidos
      </h3>
      <button onClick={onViewAll} className="btn admin-link-btn d-flex align-items-center p-0" style={{ color: "var(--admin-primary)", fontSize: 14, fontWeight: 600 }}>
        Ver todo <ChevronRight size={18} className="ms-1" />
      </button>
    </div>

    <div className="d-flex gap-3 mt-auto" style={{ height: 220 }}>
      {products.map((p) => (
        <div key={p.nombre} className="admin-bar-wrap d-flex flex-column justify-content-end align-items-center flex-fill position-relative">
          <div
            className="w-100 position-relative"
            style={{
              height: `${p.alturaPcntj}%`,
              backgroundColor: p.destacar ? "var(--admin-primary)" : "color-mix(in srgb, var(--admin-primary-fixed-dim) 30%, transparent)",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          >
            <div
              className="admin-bar-tooltip position-absolute top-0 start-50 translate-middle-x px-2 py-1 rounded"
              style={{ marginTop: -32, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}
            >
              {p.valor}
            </div>
          </div>
          <span className="mt-2 text-center w-100 text-truncate" style={{ fontSize: 12, fontWeight: 700, color: "var(--admin-on-surface-variant)" }}>
            {p.nombre}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default ProductosDestacados;
