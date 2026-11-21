
import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";

import CategoriaForm from "../components/Categoria/CategoriasForm";
import { catergoriaService } from "../services/CategoriaService";
import type { Categoria } from "../data/Categoria";
import SaleToast from "../features/ventas/components/SaleToast";

const mensajeError = (error: unknown, porDefecto: string): string => {
  if (isAxiosError(error)) {
    const detalle = error.response?.data?.detail;

    if (typeof detalle === "string") {
      return detalle;
    }
  }

  return porDefecto;
};

export const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Modal de crear y editar
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [categoriaEditar, setCategoriaEditar] =
    useState<Categoria | null>(null);

  // Buscador
  const [busquedad, setBusqueda] = useState("");

  // Confirmación de eliminación
  const [porEliminar, setPorEliminar] = useState<Categoria | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Notificaciones
  const [toast, setToast] = useState<{
    visible: boolean;
    titulo: string;
    mensaje: string;
    tono: "exito" | "error";
  }>({
    visible: false,
    titulo: "",
    mensaje: "",
    tono: "exito",
  });

  // Animación de éxito
  const [animando, setAnimando] = useState(false);

  const temporizadorToast = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const temporizadorAnim = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Mostrar notificación y animación
  const mostrarToast = useCallback(
    (
      titulo: string,
      mensaje: string,
      tono: "exito" | "error" = "exito",
    ) => {
      if (temporizadorToast.current) {
        clearTimeout(temporizadorToast.current);
      }

      setToast({
        visible: true,
        titulo,
        mensaje,
        tono,
      });

      temporizadorToast.current = setTimeout(() => {
        setToast((anterior) => ({
          ...anterior,
          visible: false,
        }));
      }, 3000);

      if (tono === "exito") {
        if (temporizadorAnim.current) {
          clearTimeout(temporizadorAnim.current);
        }

        setAnimando(true);

        temporizadorAnim.current = setTimeout(() => {
          setAnimando(false);
        }, 1000);
      }
    },
    [],
  );

  // READ: Recargar categorías después de crear o editar
  const cargarCategorias = async () => {
    try {
      setError("");

      const datos = await catergoriaService.listarCategorias();

      setCategorias(datos);
    } catch {
      setError(
        "No se pudieron cargar las categorías. ¿Está corriendo FastAPI?",
      );
    } finally {
      setCargando(false);
    }
  };

  // Carga inicial sin actualizar el estado directamente en el efecto
  useEffect(() => {
    let activo = true;

    catergoriaService
      .listarCategorias()
      .then((datos) => {
        if (activo) {
          setCategorias(datos);
          setError("");
        }
      })
      .catch(() => {
        if (activo) {
          setError(
            "No se pudieron cargar las categorías. ¿Está corriendo FastAPI?",
          );
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  // Limpiar temporizadores al desmontar el componente
  useEffect(() => {
    return () => {
      if (temporizadorToast.current) {
        clearTimeout(temporizadorToast.current);
      }

      if (temporizadorAnim.current) {
        clearTimeout(temporizadorAnim.current);
      }
    };
  }, []);

  // ABRIR MODAL PARA CREAR
  const abrirNuevaCategoria = () => {
    setCategoriaEditar(null);
    setErrorModal("");
    setShowModal(true);
  };

  // ABRIR MODAL PARA EDITAR
  const editarCategoria = (categoria: Categoria) => {
    setCategoriaEditar(categoria);
    setErrorModal("");
    setShowModal(true);
  };

  // CERRAR MODAL
  const cerrarModal = () => {
    setShowModal(false);
    setCategoriaEditar(null);
    setErrorModal("");
  };

  // CREATE / UPDATE
  const guardarCategoria = async (
    datos: Omit<Categoria, "id">,
  ) => {
    const editando = categoriaEditar !== null;

    try {
      setErrorModal("");

      if (categoriaEditar) {
        await catergoriaService.actualizarCategoria(
          categoriaEditar.id,
          datos,
        );
      } else {
        await catergoriaService.crearCategoria(datos);
      }

      // Cerrar modal y mostrar notificación
      cerrarModal();

      mostrarToast(
        editando ? "Categoría actualizada" : "Categoría creada",
        editando
          ? "Los cambios se guardaron correctamente."
          : "La categoría se registró correctamente.",
      );

      // Actualizar la lista en segundo plano
      void cargarCategorias();
    } catch (err) {
      setErrorModal(
        mensajeError(err, "No se pudo guardar la categoría."),
      );
    }
  };

  // DELETE: Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!porEliminar) return;

    const { id, nombre } = porEliminar;

    setEliminando(true);

    try {
      await catergoriaService.eliminarCategoria(id);

      // Actualizar la tabla inmediatamente
      setCategorias((anterior) =>
        anterior.filter((categoria) => categoria.id !== id),
      );

      setPorEliminar(null);

      mostrarToast(
        "Categoría eliminada",
        `"${nombre}" fue eliminada correctamente.`,
      );
    } catch (err) {
      setPorEliminar(null);

      mostrarToast(
        "No se pudo eliminar",
        mensajeError(
          err,
          "No se pudo eliminar la categoría. Puede tener productos asociados.",
        ),
        "error",
      );
    } finally {
      setEliminando(false);
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
            className="btn btn-dark fw-semibold"
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
        <div className="card-body p-0 table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 ps-4 text-muted small fw-bold">#</th>

                <th className="py-3 text-muted small fw-bold">
                  CATEGORÍA
                </th>

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
                      <button
                        className="btn btn-sm btn-outline-dark me-2"
                        title="Editar Categoría"
                        onClick={() => editarCategoria(categoria)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        title="Eliminar Categoría"
                        onClick={() => setPorEliminar(categoria)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
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

      {/* ================= MODAL CREAR / EDITAR ================= */}
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

                  {categoriaEditar
                    ? "Editar Categoría"
                    : "Nueva Categoría"}
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
                  key={
                    categoriaEditar
                      ? `editar-${categoriaEditar.id}`
                      : "nueva-categoria"
                  }
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
                  className="btn btn-light"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  form="categoriaForm"
                  className="btn btn-dark"
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

      {/* ================= MODAL CONFIRMAR ELIMINACIÓN ================= */}
      {porEliminar && (
        <div
          className="d-flex align-items-center justify-content-center p-3"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2100,
            backgroundColor: "rgba(60, 40, 25, 0.45)",
          }}
          onClick={() => !eliminando && setPorEliminar(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4 text-center"
            style={{
              width: "100%",
              maxWidth: 400,
              animation: "checkPop 0.25s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#f1e4d1",
                color: "var(--admin-primary, #6f4e37)",
                fontSize: 28,
              }}
            >
              <i className="bi bi-trash"></i>
            </div>

            <h5
              className="fw-bold mb-2"
              style={{ color: "var(--admin-primary, #6f4e37)" }}
            >
              ¿Eliminar categoría?
            </h5>

            <p className="text-muted mb-4" style={{ fontSize: 14 }}>
              Vas a eliminar <strong>"{porEliminar.nombre}"</strong>. Esta
              acción no se puede deshacer.
            </p>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn flex-fill rounded-pill fw-semibold"
                style={{
                  backgroundColor: "#f1e4d1",
                  color: "var(--admin-primary, #6f4e37)",
                }}
                disabled={eliminando}
                onClick={() => setPorEliminar(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn flex-fill rounded-pill fw-semibold"
                style={{
                  backgroundColor: "var(--admin-primary, #6f4e37)",
                  color: "#ffffff",
                }}
                disabled={eliminando}
                onClick={confirmarEliminacion}
              >
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ANIMACIÓN DE ÉXITO ================= */}
      <style>{`
        @keyframes checkPop {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }

          60% {
            transform: scale(1.08);
            opacity: 1;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {animando && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            pointerEvents: "none",
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{
              width: 96,
              height: 96,
              backgroundColor: "var(--admin-primary, #6f4e37)",
              color: "#ffffff",
              fontSize: 52,
              animation: "checkPop 0.4s ease-out",
            }}
          >
            <i className="bi bi-check-lg"></i>
          </div>
        </div>
      )}

      {/* NOTIFICACIONES */}
      <SaleToast
        visible={toast.visible}
        titulo={toast.titulo}
        mensaje={toast.mensaje}
        tono={toast.tono}
      />
    </div>
  );
};
