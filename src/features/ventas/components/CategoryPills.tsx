import type { FC, ReactElement } from "react";
import type { CategoriaOpcion } from "../hooks/useProductosPOS";

interface CategoryPillsProps {
  categorias: CategoriaOpcion[];
  activa: string;
  alCambiar: (categoria: string) => void;
}

const CategoryPills: FC<CategoryPillsProps> = ({ categorias, activa, alCambiar }): ReactElement => (
  <div className="d-flex align-items-center gap-2 overflow-auto pb-1">
    {categorias.map(({ etiqueta, total }) => {
      const activo = etiqueta === activa;
      return (
        <button
          key={etiqueta}
          type="button"
          onClick={() => alCambiar(etiqueta)}
          className="btn rounded-pill px-3 py-2 flex-shrink-0"
          style={{
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: activo ? "var(--admin-primary)" : "var(--admin-surface-container-low)",
            color: activo ? "#ffffff" : "var(--admin-on-surface-variant)",
          }}
        >
          {etiqueta} ({total})
        </button>
      );
    })}
  </div>
);

export default CategoryPills;
