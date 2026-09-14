import type { FC, ReactElement } from "react";
import { Coffee, Plus } from "lucide-react";
import { formatoMoneda } from "../../dashboard/utils/dashboardMetrics";
import type { Producto } from "../../../data/Producto";

interface ProductCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

const ProductCard: FC<ProductCardProps> = ({ producto, onAgregar }): ReactElement => {
  const sinStock = producto.stock <= 0;

  return (
    <button
      type="button"
      onClick={() => onAgregar(producto)}
      disabled={sinStock}
      className="admin-card rounded-4 p-3 border text-start d-flex flex-column justify-content-between h-100 w-100"
      style={{ cursor: sinStock ? "not-allowed" : "pointer", opacity: sinStock ? 0.5 : 1 }}
    >
      <div className="d-flex flex-column gap-2">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center position-relative"
          style={{ aspectRatio: "1 / 1", backgroundColor: "var(--admin-secondary-container)" }}
        >
          <Coffee size={32} color="var(--admin-primary)" />
          <span
            className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: producto.stock < 15 ? "#fdecea" : "rgba(255,255,255,0.85)",
              color: producto.stock < 15 ? "#b3261e" : "var(--admin-on-surface-variant)",
            }}
          >
            {sinStock ? "Sin stock" : `Stock: ${producto.stock}`}
          </span>
        </div>
        <div>
          <span className="d-block text-uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "var(--admin-secondary)" }}>
            {producto.categoria}
          </span>
          <h3 className="mb-0 mt-1" style={{ fontFamily: "var(--admin-font-display)", fontSize: 16, fontWeight: 600, color: "var(--admin-on-surface)" }}>
            {producto.nombre}
          </h3>
          <span style={{ fontSize: 11, color: "var(--admin-on-surface-variant)" }}>{producto.codigo}</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3 pt-2">
        <span style={{ fontFamily: "var(--admin-font-display)", fontSize: 18, fontWeight: 700, color: "var(--admin-primary)" }}>
          {formatoMoneda(producto.precioVenta)}
        </span>
        <span
          className="rounded-2 d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, backgroundColor: "var(--admin-secondary-container)", color: "var(--admin-primary)" }}
        >
          <Plus size={18} />
        </span>
      </div>
    </button>
  );
};

export default ProductCard;
