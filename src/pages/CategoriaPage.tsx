import React from "react";
import categoriesMock from "../data/Categoria";

export const Categorias = () => {
  return (
    <div className="container mt-4">

      {/* Cabecera */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0">
            Collins Café{" "}
            <span className="text-secondary fw-normal">/ Categorías</span>
          </h2>

          <small className="text-muted">
            Gestión y organización de las categorías de productos
          </small>
        </div>

        <div>
          <button className="btn btn-outline-secondary me-2">
            <i className="bi bi-file-earmark-pdf me-1"></i>
            PDF
          </button>

          <button className="btn btn-cafe fw-semibold">
            <i className="bi bi-plus-lg me-1"></i>
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Métricas y búsqueda */}
      <div className="row mb-4">

        {/* Métrica */}
        <div className="col-md-5 d-flex gap-3 mb-3 mb-md-0">
          <div className="card shadow-sm flex-fill border-0 rounded-4">
            <div className="card-body py-3 d-flex align-items-center">

              <div className="bg-cafe-light p-3 rounded-3 me-3 text-cafe">
                <i className="bi bi-tags fs-3"></i>
              </div>

              <div>
                <small
                  className="text-muted fw-bold d-block"
                  style={{ letterSpacing: "1px" }}
                >
                  CATEGORÍAS
                </small>

                <h4 className="mb-0 fw-bold">
                  {categoriesMock.length}
                </h4>
              </div>

            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="col-md-7 d-flex">
          <div className="card shadow-sm border-0 rounded-4 w-100">
            <div className="card-body py-2 d-flex align-items-center gap-3">

              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Buscar categoría..."
                />
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Tabla */}
      <div className="card shadow-sm border-0 rounded-4">

        <div className="card-body p-0">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th className="py-3 ps-4 text-muted small fw-bold">
                  #
                </th>

                <th className="py-3 text-muted small fw-bold">
                  CATEGORÍA
                </th>

                <th className="py-3 pe-4 text-muted small fw-bold text-end">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody>

              {categoriesMock.map((categoria, index) => (
                <tr key={categoria.id}>

                  <td className="ps-4 text-muted">
                    {index + 1}
                  </td>

                  <td className="fw-semibold">
                    {categoria.nombre}
                  </td>

                  <td className="pe-4 text-end">

                    <button
                      className="btn btn-sm btn-outline-cafe text-uppercase"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      Editar
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};