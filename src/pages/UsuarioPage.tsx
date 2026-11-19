import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { UsuarioService } from "../services/UsuarioService";
import UsuarioForm from "../components/Usuario/UsuarioForm";
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "../data/Usuario";
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

export const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos los roles");

  // Confirmación de eliminación
  const [porEliminar, setPorEliminar] = useState<Usuario | null>(null);
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

  const cargarUsuarios = async () => {
    const datos = await UsuarioService.listarUsuarios();
    setUsuarios(datos);
  };

  useEffect(() => {
    let activo = true;

    Promise.all([UsuarioService.listarUsuarios(), rolService.listarRoles()])
      .then(([listaUsuarios, listaRoles]) => {
        if (!activo) return;
        setUsuarios(listaUsuarios);
        setRoles(listaRoles);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        if (activo) {
          mostrarToast(
            "Error al cargar",
            "No se pudieron cargar los usuarios o los roles.",
            "error",
          );
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [mostrarToast]);

  const abrirNuevoUsuario = () => {
    setUsuarioEditar(null);
    setShowModal(true);
  };

  const abrirEditarUsuario = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setUsuarioEditar(null);
  };

  const guardarUsuario = async (
    datos: UsuarioCreate | UsuarioUpdate,
  ): Promise<void> => {
    try {
      const editando = usuarioEditar !== null;

      if (usuarioEditar) {
        await UsuarioService.actualizarUsuario(
          usuarioEditar.id,
          datos as UsuarioUpdate,
        );
      } else {
        await UsuarioService.crearUsuario(datos as UsuarioCreate);
      }

      // Cierra el formulario al instante y avisa
      cerrarModal();
      mostrarToast(
        editando ? "Usuario actualizado" : "Usuario creado",
        editando
          ? "Los cambios se guardaron correctamente."
          : "El usuario se registró correctamente.",
      );

      // La lista se refresca en segundo plano
      cargarUsuarios().catch((e) => console.error(e));
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      mostrarToast(
        "No se pudo guardar",
        mensajeError(
          error,
          "No se pudo guardar el usuario. Verifica los datos y la conexión.",
        ),
        "error",
      );
      throw error;
    }
  };

  const confirmarEliminacion = async () => {
    if (!porEliminar) return;
    const { id, nombre } = porEliminar;

    setEliminando(true);
    try {
      await UsuarioService.eliminarUsuario(id);
      setUsuarios((anterior) => anterior.filter((u) => u.id !== id));
      setPorEliminar(null);
      mostrarToast("Usuario eliminado", `"${nombre}" fue eliminado.`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setPorEliminar(null);
      mostrarToast(
        "No se pudo eliminar",
        mensajeError(error, "No se pudo eliminar el usuario."),
        "error",
      );
    } finally {
      setEliminando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.codigo.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto);

    const coincideRol =
      rolFiltro === "Todos los roles" || String(usuario.id_rol) === rolFiltro;

    return coincideBusqueda && coincideRol;
  });

  const usuariosActivos = usuarios.filter((u) => u.estado === "Activo").length;

  return (
    <div className="container-fluid py-4">
      {/* CABECERA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0 text-dark">Usuarios</h2>
          <small className="text-muted">
            Gestión de accesos y personal del sistema
          </small>
        </div>

        <div>
          <button
            className="btn btn-dark fw-semibold"
            onClick={abrirNuevoUsuario}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* MÉTRICAS Y FILTROS */}
      <div className="row mb-4">
        <div className="col-md-5 d-flex gap-3 mb-3 mb-md-0">
          <div className="card shadow-sm flex-fill border-0">
            <div className="card-body py-3 d-flex align-items-center">
              <div className="bg-light p-3 rounded-3 me-3 text-dark">
                <i className="bi bi-people fs-3"></i>
              </div>
              <div>
                <small className="text-muted fw-bold d-block">TOTAL</small>
                <h4 className="mb-0 fw-bold">{usuarios.length}</h4>
              </div>
            </div>
          </div>

          <div className="card shadow-sm flex-fill border-0">
            <div className="card-body py-3 d-flex align-items-center">
              <div className="bg-light p-3 rounded-3 me-3 text-success">
                <i className="bi bi-person-check fs-3"></i>
              </div>
              <div>
                <small className="text-muted fw-bold d-block">ACTIVOS</small>
                <h4 className="mb-0 fw-bold">{usuariosActivos}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7 d-flex">
          <div className="card shadow-sm border-0 w-100">
            <div className="card-body py-2 d-flex flex-column flex-md-row align-items-center gap-3 h-100">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                className="form-select border-0 bg-light"
                style={{ width: "auto", minWidth: "180px" }}
                value={rolFiltro}
                onChange={(e) => setRolFiltro(e.target.value)}
              >
                <option value="Todos los roles">Todos los roles</option>

                {roles.map((rol) => (
                  <option key={rol.id_rol} value={String(rol.id_rol)}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA */}
      {cargando ? (
        <div className="text-center py-5">Cargando usuarios...</div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0 table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 ps-4 text-muted small fw-bold">CÓDIGO</th>
                  <th className="py-3 text-muted small fw-bold">NOMBRE</th>
                  <th className="py-3 text-muted small fw-bold">CORREO</th>
                  <th className="py-3 text-muted small fw-bold">ROL</th>
                  <th className="py-3 text-muted small fw-bold">ESTADO</th>
                  <th className="py-3 pe-4 text-muted small fw-bold text-end">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => {
                    const nombreRol = roles.find(
                      (rol) => rol.id_rol === usuario.id_rol,
                    )?.nombre;

                    return (
                      <tr key={usuario.id}>
                        <td className="ps-4 fw-bold text-secondary">
                          {usuario.codigo}
                        </td>

                        <td className="fw-semibold">{usuario.nombre}</td>

                        <td>{usuario.correo}</td>

                        <td>
                          <span
                            className={`badge ${
                              nombreRol === "Administrador"
                                ? "bg-primary"
                                : "bg-info text-dark"
                            }`}
                          >
                            {nombreRol ?? "Rol no encontrado"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              usuario.estado === "Activo"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {usuario.estado}
                          </span>
                        </td>

                        <td className="pe-4 text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark me-2"
                            onClick={() => abrirEditarUsuario(usuario)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => setPorEliminar(usuario)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">
                  {usuarioEditar ? "Editar Usuario" : "Nuevo Usuario"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>

              <div className="modal-body">
                <UsuarioForm
                  usuarioEditar={usuarioEditar}
                  onGuardar={guardarUsuario}
                  onCancelar={cerrarModal}
                />
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
              ¿Eliminar usuario?
            </h5>
            <p className="text-muted mb-4" style={{ fontSize: 14 }}>
              Vas a eliminar a <strong>"{porEliminar.nombre}"</strong>. Esta
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