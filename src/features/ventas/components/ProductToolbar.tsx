import type { FC, ReactElement } from "react";
import { Search, Percent } from "lucide-react";

interface ProductToolbarProps {
  busqueda: string;
  onBuscar: (valor: string) => void;
  descuentoActivo: boolean;
  onAbrirDescuento: () => void;
}

const ProductToolbar: FC<ProductToolbarProps> = ({
  busqueda,
  onBuscar,
  descuentoActivo,
  onAbrirDescuento,
}): ReactElement => (
  <div className="d-flex align-items-center gap-2">
    <div className="position-relative flex-grow-1">
      <Search
        size={18}
        className="position-absolute top-50 start-0 translate-middle-y ms-3"
        style={{ color: "var(--admin-on-surface-variant)" }}
      />
      <input
        type="text"
        value={busqueda}
        onChange={(e) => onBuscar(e.target.value)}
        placeholder="Buscar por nombre o código..."
        className="form-control rounded-3 ps-5 py-2"
        style={{ backgroundColor: "var(--admin-surface-container-low)", border: "1px solid transparent", fontSize: 14 }}
      />
    </div>
    <button
      type="button"
      onClick={onAbrirDescuento}
      className="btn d-flex align-items-center gap-2 rounded-3 px-3 py-2"
      style={{
        backgroundColor: descuentoActivo ? "var(--admin-primary)" : "var(--admin-secondary-container)",
        color: descuentoActivo ? "#ffffff" : "var(--admin-primary)",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <Percent size={18} />
      <span className="d-none d-md-inline">{descuentoActivo ? "Descuento (10%)" : "Descuento"}</span>
    </button>
  </div>
);

export default ProductToolbar;
