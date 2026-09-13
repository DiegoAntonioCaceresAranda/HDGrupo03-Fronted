import React, { useEffect, useState } from "react";
import { type Usuario } from "../../data/Usuario";

interface UsuarioFormProps {
    usuarioEditar: Usuario | null;
    onGuardar: (usuario: Omit<Usuario, "id" | "codigo">) => void;
    onCancelar: () => void;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
    usuarioEditar,
    onGuardar,
    onCancelar
}) => {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [rol, setRol] = useState<"Administrador" | "Empleado" | "">("");
    const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");

    useEffect(() => {
        if (usuarioEditar) {
            setNombre(usuarioEditar.nombre);
            setCorreo(usuarioEditar.correo);
            setRol(usuarioEditar.rol);
            setEstado(usuarioEditar.estado);
        } else {
            setNombre("");
            setCorreo("");
            setRol("");
            setEstado("Activo");
        }
    }, [usuarioEditar]);

    const manejarSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre || !correo || !rol || !estado) {
            alert("Completa todos los campos obligatorios.");
            return;
        }

        const usuario: Omit<Usuario, "id" | "codigo"> = {
            nombre,
            correo,
            rol: rol as "Administrador" | "Empleado",
            estado: estado as "Activo" | "Inactivo"
        };

        onGuardar(usuario);
    };

    return (
        <form onSubmit={manejarSubmit}>
            <div className="row g-3">
                {/* Nombre */}
                <div className="col-md-12">
                    <label className="form-label fw-bold small text-muted">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        placeholder="Ingrese Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                {/* Correo */}
                <div className="col-md-12">
                    <label className="form-label fw-bold small text-muted">
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        name="correo"
                        className="form-control"
                        placeholder="ejemplo@collinscafe.com"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>

                {/* Rol */}
                <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">
                        Rol del Sistema
                    </label>
                    <select
                        className="form-select"
                        value={rol}
                        onChange={(e) => setRol(e.target.value as any)}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Empleado">Empleado</option>
                    </select>
                </div>

                {/* Estado */}
                <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">
                        Estado
                    </label>
                    <select
                        className="form-select"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value as any)}
                        required
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-dark"
                >
                    {usuarioEditar ? "Actualizar Usuario" : "Guardar Usuario"}
                </button>
            </div>
        </form>
    );
};

export default UsuarioForm;