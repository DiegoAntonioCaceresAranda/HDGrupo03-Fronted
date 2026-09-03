import React from "react";

const CategoriaForm = () => {
  return (
    <form>

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
          required
        />

      </div>


      {/* Descripción */}
      <div className="mb-3">

        <label className="form-label fw-bold small text-muted">
          Descripción
        </label>

        <textarea
          name="descripcion"
          className="form-control"
          rows={3}
          placeholder="Descripción de la categoría..."
        ></textarea>

      </div>

    </form>
  );
};

export default CategoriaForm;