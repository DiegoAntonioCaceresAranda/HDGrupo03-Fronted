import React, { useEffect, useState } from "react";
import type { Categoria } from "../../data/Categoria";

interface CategoriaFormProps {
  categoria?: Categoria | null;
  onSave: (datos: Omit<Categoria, "id">) => void;
}

const CategoriaForm = ({
  categoria,
  onSave
}: CategoriaFormProps) => {

  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
    } else {
      setNombre("");
    }
  }, [categoria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim) {
      return;
    }

    onSave({
      nombre: nombre.trim()
    });
  }

  return (
    <form id="categoriaForm" onSubmit={handleSubmit}>
      {/* Nombre */}
      <div className="mb-4">
        <label className="form-label fw-bold small text-muted">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          name="nombre"
          className="form-control"
          placeholder="Ej. Bebidas Calientes"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
    </form>
  );
};

export default CategoriaForm;