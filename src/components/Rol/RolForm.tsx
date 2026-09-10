import React, { useEffect, useState } from "react";
const RolesForm = () => {
    return (
        <form>
            <div className="mb-3">
                <label className="form-label fw-semibold">
                    Nombre del rol
                </label>
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Ej. Empleado"
                    maxlength={50}
                />
            </div>
            <div className="mb-3">
                <label className="form-label fw-semibold">
                    Description
                </label>
                <textarea
                className="form-control"
                rows={4}
                placeholder="Ingrese una descripción"
                maxlength={200}
                />
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button
                type="button"
                className="btn btn-secondary"
                >
                    Cancelar
                </button>
                <button
                type="submit"
                className="btn btn-cafe"
                >
                    Gestionar Rol
                </button>
            </div>
        </form>
    )
}