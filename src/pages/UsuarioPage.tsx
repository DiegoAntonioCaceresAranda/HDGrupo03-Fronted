import React, { useState } from "react";

import { UsuarioService } from "../services/UsuarioService";
import UsuarioForm from "../components/Usuario/UsuarioForm";
import { type Usuario } from "../data/Usuario";

import AdminLayout from "../components/AdminLayout";

export const UsuarioPage = () => {

    // =========================
    // ESTADOS
    // =========================

    const [usuarios, setUsuarios] = useState<Usuario[]>(
        UsuarioService.listarUsuarios()
    );

    const [showModal, setShowModal] = useState(false);

    const [usuarioEditar, setUsuarioEditar] =
        useState<Usuario | null>(null);

    const [busqueda, setBusqueda] = useState("");

    const [rolFiltro, setRolFiltro] =
        useState("Todos los roles");


    // =========================
    // ABRIR MODAL - NUEVO
    // =========================

    const abrirNuevoUsuario = () => {
        setUsuarioEditar(null);
        setShowModal(true);
    };


    // =========================
    // ABRIR MODAL - EDITAR


    const abrirEditarUsuario = (usuario: Usuario) => {
        setUsuarioEditar(usuario);
        setShowModal(true);
    };


    // =========================
    // CERRAR MODAL


    const cerrarModal = () => {
        setShowModal(false);
        setUsuarioEditar(null);
    };


    // =========================
    // GUARDAR USUARIO
    // =========================

    const guardarUsuario = (
        datos: Omit<Usuario, "id" | "codigo">
    ) => {

        if (usuarioEditar) {

            // UPDATE
            const usuarioActualizado =
                UsuarioService.actualizarUsuario(
                    usuarioEditar.id,
                    datos
                );

            if (usuarioActualizado) {
                setUsuarios(
                    UsuarioService.listarUsuarios()
                );
                alert("Usuario actualizado correctamente.");
            }

        } else {

            // CREATE
            UsuarioService.crearUsuario(datos);

            setUsuarios(
                UsuarioService.listarUsuarios()
            );

            alert("Usuario creado correctamente.");
        }

        cerrarModal();
    };


    // =========================
    // ELIMINAR USUARIO


    const eliminarUsuario = (
        id: number,
        nombre: string
    ) => {

        if (
            window.confirm(
                `¿Estás seguro de que deseas eliminar a: ${nombre}?`
            )
        ) {

            const eliminado =
                UsuarioService.eliminarUsuario(id);

            if (eliminado) {
                setUsuarios(
                    UsuarioService.listarUsuarios()
                );
                alert("Usuario eliminado correctamente.");
            }
        }
    };


    // =========================
    // FILTROS
    // =========================

    const usuariosFiltrados = usuarios.filter(
        (usuario) => {

            const coincideBusqueda =
                usuario.nombre
                    .toLowerCase()
                    .includes(busqueda.toLowerCase()) ||
                usuario.codigo
                    .toLowerCase()
                    .includes(busqueda.toLowerCase());

            const coincideRol =
                rolFiltro === "Todos los roles" ||
                usuario.rol === rolFiltro;

            return (
                coincideBusqueda &&
                coincideRol
            );
        }
    );


    // =========================
    // MÉTRICAS
    // =========================

    const usuariosActivos = usuarios.filter(u => u.estado === 'Activo').length;


    // =========================
    // RETURN
    // =========================

    // de aqui llama al (AdminLayout), (barrita marrón se activa con linea 168)
    return (
        <AdminLayout activePath="/admin/users">

            <div className="container-fluid py-4">

                {/* =========================
                    CABECERA
                ========================= */}

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">

                    <div>
                        <h2 className="fw-bold mb-0 text-dark">
                            Usuarios
                        </h2>
                        <small className="text-muted">
                            Gestión de accesos y personal del sistema
                        </small>
                    </div>

                    <div>
                        <button
                            className="btn btn-outline-secondary me-2"
                        >
                            <i className="bi bi-file-earmark-pdf me-1"></i>
                            PDF
                        </button>

                        <button
                            className="btn btn-dark fw-semibold"
                            onClick={abrirNuevoUsuario}
                        >
                            <i className="bi bi-plus-lg me-1"></i>
                            Nuevo Usuario
                        </button>
                    </div>

                </div>


                {/* =========================
                    MÉTRICAS Y FILTROS
                ========================= */}

                <div className="row mb-4">

                    <div className="col-md-5 d-flex gap-3 mb-3 mb-md-0">

                        {/* TOTAL USUARIOS */}
                        <div className="card shadow-sm flex-fill border-0">
                            <div className="card-body py-3 d-flex align-items-center">
                                <div className="bg-light p-3 rounded-3 me-3 text-dark">
                                    <i className="bi bi-people fs-3"></i>
                                </div>
                                <div>
                                    <small className="text-muted fw-bold d-block">
                                        TOTAL
                                    </small>
                                    <h4 className="mb-0 fw-bold">
                                        {usuarios.length}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* ACTIVOS */}
                        <div className="card shadow-sm flex-fill border-0">
                            <div className="card-body py-3 d-flex align-items-center">
                                <div className="bg-light p-3 rounded-3 me-3 text-success">
                                    <i className="bi bi-person-check fs-3"></i>
                                </div>
                                <div>
                                    <small className="text-muted fw-bold d-block">
                                        ACTIVOS
                                    </small>
                                    <h4 className="mb-0 fw-bold">
                                        {usuariosActivos}
                                    </h4>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* FILTROS */}
                    <div className="col-md-7 d-flex">
                        <div className="card shadow-sm border-0 w-100">
                            <div className="card-body py-2 d-flex flex-column flex-md-row align-items-center gap-3 h-100">

                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    placeholder="Buscar usuario..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                />

                                <select
                                    className="form-select border-0 bg-light"
                                    style={{
                                        width: "auto",
                                        minWidth: "180px"
                                    }}
                                    value={rolFiltro}
                                    onChange={(e) =>
                                        setRolFiltro(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option>
                                        Todos los roles
                                    </option>
                                    <option>
                                        Administrador
                                    </option>
                                    <option>
                                        Empleado
                                    </option>
                                </select>

                            </div>
                        </div>
                    </div>

                </div>


                {/* =========================
                    TABLA
                ========================= */}

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0 table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="py-3 ps-4 text-muted small fw-bold">
                                        CÓDIGO
                                    </th>
                                    <th className="py-3 text-muted small fw-bold">
                                        NOMBRE
                                    </th>
                                    <th className="py-3 text-muted small fw-bold">
                                        CORREO
                                    </th>
                                    <th className="py-3 text-muted small fw-bold">
                                        ROL
                                    </th>
                                    <th className="py-3 text-muted small fw-bold">
                                        ESTADO
                                    </th>
                                    <th className="py-3 pe-4 text-muted small fw-bold text-end">
                                        ACCIONES
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.length > 0 ? (
                                    usuariosFiltrados.map(
                                        (usuario) => (
                                            <tr key={usuario.id}>
                                                <td className="ps-4 fw-bold text-secondary">
                                                    {usuario.codigo}
                                                </td>
                                                <td className="fw-semibold">
                                                    {usuario.nombre}
                                                </td>
                                                <td>
                                                    {usuario.correo}
                                                </td>
                                                <td>
                                                    <span className={`badge ${usuario.rol === 'Administrador' ? 'bg-primary' : 'bg-info text-dark'}`}>
                                                        {usuario.rol === 'Administrador' ? 'Administrador' : 'Empleado'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                        {usuario.estado}
                                                    </span>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-dark me-2"
                                                        onClick={() =>
                                                            abrirEditarUsuario(
                                                                usuario
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            eliminarUsuario(
                                                                usuario.id,
                                                                usuario.nombre
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-5 text-muted"
                                        >
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* =========================
                    MODAL
                ========================= */}

                {showModal && (
                    <div
                        className="modal fade show d-block"
                        tabIndex={-1}
                        style={{
                            backgroundColor:
                                "rgba(0, 0, 0, 0.5)"
                        }}
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold text-dark">
                                        {usuarioEditar
                                            ? "Editar Usuario"
                                            : "Nuevo Usuario"}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={cerrarModal}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <UsuarioForm
                                        usuarioEditar={
                                            usuarioEditar
                                        }
                                        onGuardar={
                                            guardarUsuario
                                        }
                                        onCancelar={
                                            cerrarModal
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};