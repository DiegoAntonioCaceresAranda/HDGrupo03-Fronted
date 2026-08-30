import React from "react";

const CategoriaForm = () => {
    return (
        <form>
            <div className="mb-3">
                <label className="form-label fw-bold">Nombre de la Categoría</label>
                <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    required
                />
            </div>
        </form>
    );
}

export default CategoriaForm;