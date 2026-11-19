import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import RolesForm from "../components/Rol/RolForm";
import { rolService } from "../services/RolService";
import type { Rol } from "../data/Rol";
import SaleToast from "../features/ventas/components/SaleToast";
import "../styles/pos.css";

const mensajeError = (error: unknown, porDefecto: string): string => {
  if (isAxiosError(error)) {
    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }
  return porDefecto;
};

export const RolesPage = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [rolEditar, setRolEditar] = useState<Rol | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Confirmación de eliminación
  const [porEliminar, setPorEliminar] = useState<Rol | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    titulo: string;
    mensaje: string;
    tono: "exito" | "error";
  }>({ visible: false, titulo: "", mensaje: "", tono: "exito" });
  const [animando, setAnimando] = useState(false);
  const temporizadorToast = useRef<ReturnType<typeof setTimeout> | null>(null);
  const temporizadorAnim = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrarToast = useCallback(
    (titulo: string, mensaje: string, tono: "exito" | "error" = "exito") => {
      if (temporizadorToast.current) clearTimeout(temporizadorToast.current);
      setToast({ visible: true, titulo, mensaje, tono });
      temporizadorToast.current = setTimeout(() => {
        setToast((anterior) => ({ ...anterior, visible: false }));
      }, 3000);

      if (tono === "exito") {
        if (temporizadorAnim.current) clearTimeout(temporizadorAnim.current);
        setAnimando(true);
        temporizadorAnim.current = setTimeout(() => setAnimando(false), 1000);
      }
    },
    [],
  );

  // Recarga la lista (se usa después de crear o editar)
  const cargarRoles = async () => {
    try {
      setError("");
      const datos = await rolService.listarRoles();
      setRoles(datos);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError("No se pudieron cargar los roles desde el servidor.");
    }
  };

  // Carga inicial
  useEffect(() => {
    let activo = true;

    rolService
      .listarRoles()
      .then((datos) => {
        if (activo) setRoles(datos);
      })
      .catch((err) => {
        console.error("Error al cargar roles:", err);
        if (activo) {
          setError("No se pudieron cargar los roles desde el servidor.");
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const abrirNuevoRol = () => {
    setRolEditar(null);
    setShowModal(true);
  };

  const editarRol = (rol: Rol) => {
    setRolEditar(rol);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setRolEditar(null);
  };

  // ================= CREATE / UPDATE =================
  const guardarRol = async (datos: Omit<Rol, "id_rol">) => {
    try {
      const editando = rolEditar !== null;

      if (rolEditar) {
        await rolService.actualizarRol(rolEditar.id_rol, datos);
      } else {
        await rolService.crearRol(datos);
      }

      // Cierra el formulario al instante y avisa
      cerrarModal();
      mostrarToast(
        editando ? "Rol actualizado" : "Rol creado",
        editando
          ? "Los cambios se guardaron correctamente."
          : "El rol se registró correctamente.",
      );

      // La lista se refresca en segundo plano
      void cargarRoles();
    } catch (err) {
      console.error("Error al guardar rol:", err);
      mostrarToast(
        "No se pudo guardar",
        mensajeError(err, "No se pudo guardar el rol."),
        "error",
      );
    }
  };

  // ================= DELETE =================
  const confirmarEliminacion = async () => {
    if (!porEliminar) return;
    const { id_rol, nombre } = porEliminar;

    setEliminando(true);
    try {
      await rolService.eliminarRol(id_rol);
      setRoles((anterior) => anterior.filter((r) => r.id_rol !== id_rol));
      setPorEliminar(null);
      mostrarToast("Rol eliminado", `"${nombre}" fue eliminado.`);
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      setPorEliminar(null);
      mostrarToast(
        "No se pudo eliminar",
        mensajeError(err, "No se pudo eliminar el rol."),
        "error",
      );
    } finally {
      setEliminando(false);
    }
  };

  const rolesFiltrados = roles.filter((rol) =>
    `${rol.nombre} ${rol.descripcion}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  return (
    <div className="container mt-4">
      {/* CABECERA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0">
            Collins Café{" "}
            <span className="text-secondary fw-normal">/ Roles</span>
          </h2>
          <small className="text-muted">
            Gestión y administración de los roles del sistema
          </small>
        </div>
        <div>
          <button className="btn btn-dark fw-semibold" onClick={abrirNuevoRol}>
            <i className="bi bi-plus-lg me-1"></i>
            Nuevo Rol
          </button>
        </div>
      </div>

      {/* MÉTRICAS Y BUSCADOR */}
      <div className="row mb-4">
        <div className="col-md-5 d-flex gap-3 mb-3 mb-md-0">
          <div className="card shadow-sm flex-fill border-0 rounded-4">
            <div className="card-body py-3 d-flex align-items-center">
              <div className="bg-cafe-light p-3 rounded-3 me-3 text-cafe">
                <i className="bi bi-person-badge fs-3"></i>
              </div>
              <div>
                <small
                  className="text-muted fw-bold d-block"
                  style={{ letterSpacing: "1px" }}
                >
                  ROLES
                </small>
                <h4 className="mb-0 fw-bold">{roles.length}</h4>
              </div>
            </div>
          </div>
        </div>

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
                  placeholder="Buscar rol..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 ps-4 text-muted small fw-bold">#</th>
                  <th className="py-3 text-muted small fw-bold">ROL</th>
                  <th className="py-3 text-muted small fw-bold">DESCRIPCIÓN</th>
                  <th className="py-3 pe-4 text-muted small fw-bold text-end">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      Cargando roles...
                    </td>
                  </tr>
                ) : rolesFiltrados.length > 0 ? (
                  rolesFiltrados.map((rol, index) => (
                    <tr key={rol.id_rol}>
                      <td className="ps-4 text-muted">{index + 1}</td>

                      <td className="fw-semibold">{rol.nombre}</td>

                      <td className="text-muted">
                        {rol.descripcion || "Sin descripción"}
                      </td>

                      <td className="pe-4 text-end">
                        <button
                          className="btn btn-sm btn-outline-cafe me-2"
                          title="Editar Rol"
                          onClick={() => editarRol(rol)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          title="Eliminar Rol"
                          onClick={() => setPorEliminar(rol)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      {busqueda
                        ? "No se encontraron roles."
                        : "No hay roles registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FORMULARIO */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold text-cafe">
                  <i className="bi bi-person-badge me-2"></i>
                  {rolEditar ? "Editar Rol" : "Nuevo Rol"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                <RolesForm roles={rolEditar} onSave={guardarRol} />
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button type="submit" form="rolForm" className="btn btn-dark">
                  <i className="bi bi-check-lg me-2"></i>
                  {rolEditar ? "Actualizar Rol" : "Guardar Rol"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
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
              ¿Eliminar rol?
            </h5>
            <p className="text-muted mb-4" style={{ fontSize: 14 }}>
              Vas a eliminar el rol <strong>"{porEliminar.nombre}"</strong>.
              Esta acción no se puede deshacer.
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

      {/* ANIMACIÓN DE ÉXITO */}
      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
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

      <SaleToast
        visible={toast.visible}
        titulo={toast.titulo}
        mensaje={toast.mensaje}
        tono={toast.tono}
      />
    </div>
  );
};

export default RolesPage;