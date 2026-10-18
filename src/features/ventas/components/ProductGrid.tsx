import type { FC, ReactElement } from "react";
import ProductCard from "./ProductCard";
import type { Producto } from "../../../services/ProductoService";

interface ProductGridProps {
  productos: Producto[];
  nombresCategorias?: Record<number, string>;
  onAgregar: (producto: Producto) => void;
}

const ProductGrid: FC<ProductGridProps> = ({
  productos,
  nombresCategorias,
  onAgregar,
}): ReactElement => {
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
        <div key={producto.id_producto} className="col-6 col-md-4 col-xl-3">
          <ProductCard
            producto={producto}
            nombreCategoria={
              producto.id_categoria
                ? nombresCategorias[producto.id_categoria] ?? "Sin categoría"
                : "Sin categoría"
            }
            onAgregar={onAgregar}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;