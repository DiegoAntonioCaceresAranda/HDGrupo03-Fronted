import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Usuario, UsuarioCreate, UsuarioUpdate } from "../../data/Usuario";
import { rolService } from "../../services/RolService";
import type { Rol } from "../../data/Rol";

interface UsuarioFormProps {
  usuarioEditar: Usuario | null;
  onGuardar: (usuario: UsuarioCreate | UsuarioUpdate) => void | Promise<void>;
  onCancelar: () => void;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  usuarioEditar,
  onGuardar,
  onCancelar,
}) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [idRol, setIdRol] = useState("");
  const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargandoRoles, setCargandoRoles] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargarRoles = async () => {
      try {
        const datos = await rolService.listarRoles();
        if (activo) setRoles(datos);
      } catch (error) {
        console.error("Error al cargar los roles:", error);
        if (activo) alert("No se pudieron cargar los roles.");
      } finally {
        if (activo) setCargandoRoles(false);
      }
    };

    void cargarRoles();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (usuarioEditar) {
      setNombre(usuarioEditar.nombre);
      setCorreo(usuarioEditar.correo);
      setPassword("");
      setIdRol(String(usuarioEditar.id_rol));
      setEstado(usuarioEditar.estado);
    } else {
      setNombre("");
      setCorreo("");
      setPassword("");
      setIdRol("");
      setEstado("Activo");
    }
  }, [usuarioEditar]);

  const manejarSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim() || !idRol) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    if (!usuarioEditar && !password.trim()) {
      alert("La contraseña es obligatoria para crear un usuario.");
      return;
    }

    if (!correo.trim().toLowerCase().endsWith("@collinscafe.com")) {
      alert("Debes usar un correo con el dominio @collinscafe.com.");
      return;
    }

    const datosBase = {
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      estado,
      id_rol: Number(idRol),
    };

    try {
      if (usuarioEditar) {
        const datos: UsuarioUpdate = {
          ...datosBase,
          ...(password.trim() ? { password } : {}),
        };
        await onGuardar(datos);
      } else {
        const datos: UsuarioCreate = {
          ...datosBase,
          password,
        };
        await onGuardar(datos);
      }
    } catch (error) {
      // El componente padre debe gestionar y mostrar los errores de la API.
      console.error("No se pudo guardar el usuario:", error);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <div className="row g-3">
        <div className="col-md-12">
          <label className="form-label fw-bold small text-muted">
            Nombre Completo
          </label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            placeholder="Ingrese nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

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

        <div className="col-md-12">
          <label className="form-label fw-bold small text-muted">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder={
              usuarioEditar
                ? "Dejar vacío para conservar la contraseña"
                : "Ingrese una contraseña"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!usuarioEditar}
            autoComplete="new-password"
          />
          {usuarioEditar && (
            <small className="text-muted">
              Solo escribe una contraseña si deseas cambiarla.
            </small>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">
            Rol del Sistema
          </label>
          <select
            className="form-select"
            value={idRol}
            onChange={(e) => setIdRol(e.target.value)}
            required
            disabled={cargandoRoles}
          >
            <option value="">
              {cargandoRoles ? "Cargando roles..." : "Seleccionar..."}
            </option>
            {roles.map((rolItem) => (
              <option key={rolItem.id_rol} value={rolItem.id_rol}>
                {rolItem.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">
            Estado
          </label>
          <select
            className="form-select"
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value as "Activo" | "Inactivo")
            }
            required
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-light"
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-dark">
          {usuarioEditar ? "Actualizar Usuario" : "Guardar Usuario"}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;