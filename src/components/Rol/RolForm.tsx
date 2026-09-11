import React, { useEffect, useState } from "react";
import type { Rol } from "../../data/Rol";

interface RolesFormProps {
  roles?: Rol | null;
  onSave: (datos: Omit<Rol, "id">) => void;
}

const RolesForm = ({ roles, onSave }: RolesFormProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (roles) {
      setNombre(roles.nombre);
      setDescripcion(roles.descripcion);
    } else {
      setNombre("");
      setDescripcion("");
    }
  }, [roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      return;
    }

    onSave({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    });
  };

  return (
    <form id="rolForm" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-semibold">Nombre del rol</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ej. Administrador"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={50}
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          rows={4}
          placeholder="Ingrese una descripción para el rol..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={200}
        />
      </div>
    </form>
  );
};

export default RolesForm;
