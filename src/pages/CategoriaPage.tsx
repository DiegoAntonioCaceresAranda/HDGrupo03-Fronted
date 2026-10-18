import { useEffect, useState } from "react";
import CategoriaForm from "../components/Categoria/CategoriasForm";
import { catergoriaService } from "../services/CategoriaService";
import type { Categoria } from "../data/Categoria";

// Saca el mensaje de error que devuelve FastAPI (detail)
const mensajeError = (err: any, porDefecto: string): string => {
  const detalle = err?.response?.data?.detail;
  return typeof detalle === "string" ? detalle : porDefecto;
};

export const CategoriasPage = () => {
  // Lista de categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  // Categoría a editar
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(
    null,
  );

  // Buscador
  const [busquedad, setBusqueda] = useState("");

  // READ
  const cargarCategorias = async () => {
    try {
      setError("");
      setCategorias(await catergoriaService.listarCategorias());
    } catch {
      setError("No se pudieron cargar las categorías. ¿Está corriendo FastAPI?");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // MODAL CREAR
  const abrirNuevaCategoria = () => {
    setCategoriaEditar(null);
    setErrorModal("");
    setShowModal(true);
  };

  // MODAL EDITAR
  const editarCategoria = (categoria: Categoria) => {
    setCategoriaEditar(categoria);
    setErrorModal("");
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setCategoriaEditar(null);
    setErrorModal("");
  };

  // CREATE / UPDATE
  const guardarCategoria = async (datos: Omit<Categoria, "id">) => {
    try {
      setErrorModal("");

      if (categoriaEditar) {
        await catergoriaService.actualizarCategoria(categoriaEditar.id, datos);
      } else {
        await catergoriaService.crearCategoria(datos);
      }

      await cargarCategorias();
      cerrarModal();
    } catch (err) {
      // Ejemplo: 409 "La categoría ya está registrada"
      setErrorModal(mensajeError(err, "No se pudo guardar la categoría."));
    }
  };

  // DELETE
  const eliminarCategoria = async (id: number, nombre: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`,
    );
    if (!confirmar) {
      return;
    }

    try {
      await catergoriaService.eliminarCategoria(id);
      await cargarCategorias();
    } catch (err) {
      alert(
        mensajeError(
          err,
          "No se pudo eliminar la categoría. Puede tener productos asociados.",
        ),
      );
    }
  };

  // SEARCH
  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(busquedad.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* ================= CABECERA ================= */}
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
          <button
            className="btn btn-cafe fw-semibold"
            onClick={abrirNuevaCategoria}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Nueva Categoría
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ================= MÉTRICAS Y BUSCADOR ================= */}
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
                <h4 className="mb-0 fw-bold">{categorias.length}</h4>
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
                  value={busquedad}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLA ================= */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 ps-4 text-muted small fw-bold">#</th>
                <th className="py-3 text-muted small fw-bold">CATEGORÍA</th>
                <th className="py-3 pe-4 text-muted small fw-bold text-end">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    Cargando categorías...
                  </td>
                </tr>
              ) : categoriasFiltradas.length > 0 ? (
                categoriasFiltradas.map((categoria, index) => (
                  <tr key={categoria.id}>
                    <td className="ps-4 text-muted">{index + 1}</td>
                    <td className="fw-semibold">{categoria.nombre}</td>
                    <td className="pe-4 text-end">
                      {/* EDITAR */}
                      <button
                        className="btn btn-sm btn-outline-cafe me-2"
                        title="Editar Categoría"
                        onClick={() => editarCategoria(categoria)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      {/* ELIMINAR */}
                      <button
                        className="btn btn-sm btn-danger"
                        title="Eliminar Categoría"
                        onClick={() =>
                          eliminarCategoria(categoria.id, categoria.nombre)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* SIN RESULTADOS */
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No se encontraron categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              {/* HEADER */}
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold text-cafe">
                  <i className="bi bi-tags me-2"></i>
                  {categoriaEditar ? "Editar Categoría" : "Nueva Categoría"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>

              {/* FORMULARIO */}
              <div className="modal-body">
                <CategoriaForm
                  categoria={categoriaEditar}
                  onSave={guardarCategoria}
                />

                {errorModal && (
                  <div className="alert alert-danger mt-3 mb-0">
                    {errorModal}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="categoriaForm"
                  className="btn btn-cafe rounded-pill px-4"
                >
                  <i className="bi bi-check-lg me-2"></i>
                  {categoriaEditar
                    ? "Actualizar Categoría"
                    : "Guardar Categoría"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};