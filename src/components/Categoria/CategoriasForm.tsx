import React, { useState } from "react";
import type { Categoria } from "../../data/Categoria";

interface CategoriaFormProps {
  categoria?: Categoria | null;
  onSave: (datos: Omit<Categoria, "id">) => void | Promise<void>;
}

const CategoriaForm = ({ categoria, onSave }: CategoriaFormProps) => {
  // El nombre se inicializa según la categoría recibida.
  // No necesitamos useEffect ni setState dentro de un efecto.
  const [nombre, setNombre] = useState(() => categoria?.nombre ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      return;
    }

    onSave({
      nombre: nombreLimpio,
    });
  };

  return (
    <form id="categoriaForm" onSubmit={handleSubmit}>
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
          autoFocus
        />
      </div>
    </form>
  );
};

export default CategoriaForm;
