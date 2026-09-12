import React, { useEffect, useState } from "react";
import RolesForm from "../components/Rol/RolForm";
import { rolService } from "../services/RolService";
import AdminLayout from "../components/AdminLayout";
import type { Rol } from "../data/Rol";

export const RolesPage = () => {
  // Lista de roles
  const [roles, setRoles] = useState<Rol[]>([]);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Rol a editar
  const [rolEditar, setRolEditar] = useState<Rol | null>(null);

  // Buscador
  const [busqueda, setBusqueda] = useState("");

  // ================= READ =================
  useEffect(() => {
    const datos = rolService.listarRoles();
    setRoles(datos);
  }, []);

  // ================= MODAL CREAR =================
  const abrirNuevoRol = () => {
    setRolEditar(null);
    setShowModal(true);
  };

  // ================= MODAL EDITAR =================
  const editarRol = (rol: Rol) => {
    setRolEditar(rol);
    setShowModal(true);
  };

  // ================= CREATE / UPDATE =================
  const guardarRol = (datos: Omit<Rol, "id">) => {
    if (rolEditar) {
      // UPDATE
      const rolActualizado = rolService.actualizarRol(rolEditar.id, datos);

      if (rolActualizado) {
        setRoles(rolService.listarRoles());
      }
    } else {
      // CREATE
      rolService.crearRol(datos);
      setRoles(rolService.listarRoles());
    }

    setShowModal(false);
    setRolEditar(null);
  };

  // ================= DELETE =================
  const eliminarRol = (id: number, nombre: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar el rol "${nombre}"?`,
    );

    if (!confirmar) {
      return;
    }
    rolService.eliminarRol(id);
    setRoles(rolService.listarRoles());
  };

  // ================= SEARCH =================
  const rolesFiltrados = roles.filter((rol) =>
    `${rol.nombre} ${rol.descripcion}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="container mt-4">
        {/* ================= CABECERA ================= */}
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
            <button
              className="btn btn-cafe fw-semibold"
              onClick={abrirNuevoRol}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Nuevo Rol
            </button>
          </div>
        </div>

        {/* ================= MÉTRICAS Y BUSCADOR ================= */}
        <div className="row mb-4">
          {/* MÉTRICA */}
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

          {/* BUSCADOR */}
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

        {/* ================= TABLA ================= */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 ps-4 text-muted small fw-bold">#</th>
                    <th className="py-3 text-muted small fw-bold">ROL</th>
                    <th className="py-3 text-muted small fw-bold">
                      DESCRIPCIÓN
                    </th>
                    <th className="py-3 pe-4 text-muted small fw-bold text-end">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rolesFiltrados.length > 0 ? (
                    rolesFiltrados.map((rol, index) => (
                      <tr key={rol.id}>
                        <td className="ps-4 text-muted">{index + 1}</td>
                        <td className="fw-semibold">{rol.nombre}</td>
                        <td className="text-muted">
                          {rol.descripcion || "Sin descripción"}
                        </td>
                        <td className="pe-4 text-end">
                          {/* EDITAR */}
                          <button
                            className="btn btn-sm btn-outline-cafe me-2"
                            title="Editar Rol"
                            onClick={() => editarRol(rol)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          {/* ELIMINAR */}
                          <button
                            className="btn btn-sm btn-danger"
                            title="Eliminar Rol"
                            onClick={() => eliminarRol(rol.id, rol.nombre)}
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
                    <i className="bi bi-person-badge me-2"></i>
                    {rolEditar ? "Editar Rol" : "Nuevo Rol"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setRolEditar(null);
                    }}
                  ></button>
                </div>
                {/* FORMULARIO */}
                <div className="modal-body">
                  <RolesForm roles={rolEditar} onSave={guardarRol} />
                </div>
                {/* FOOTER */}
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => {
                      setShowModal(false);
                      setRolEditar(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    form="rolForm"
                    className="btn btn-cafe rounded-pill px-4"
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    {rolEditar ? "Actualizar Rol" : "Guardar Rol"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RolesPage;
