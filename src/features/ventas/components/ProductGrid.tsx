import type { FC, ReactElement } from "react";
import ProductCard from "./ProductCard";
import type { Producto } from "../../../data/Producto";

interface ProductGridProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

const ProductGrid: FC<ProductGridProps> = ({ productos, onAgregar }): ReactElement => {
  if (productos.length === 0) {
    return (
      <div className="text-center py-5" style={{ color: "var(--admin-on-surface-variant)" }}>
        No se encontraron productos con ese filtro.
      </div>
    );
  }

  return (
    <div className="row g-3">
      {productos.map((producto) => (
        <div key={producto.id} className="col-6 col-md-4 col-xl-3">
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
