import React, { useEffect, useState } from "react";
import { type Producto } from "../../data/Producto";

interface ProductosFormProps {
    productoEditar: Producto | null;
    onGuardar: (producto: Omit<Producto, "id">) => void;
    onCancelar: () => void;
}

const ProductosForm: React.FC<ProductosFormProps> = ({
    productoEditar,
    onGuardar,
    onCancelar
}) => {

    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precioVenta, setPrecioVenta] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {

        if (productoEditar) {
            setCodigo(productoEditar.codigo);
            setNombre(productoEditar.nombre);
            setCategoria(productoEditar.categoria);
            setPrecioVenta(productoEditar.precioVenta.toString());
            setStock(productoEditar.stock.toString());
        } else {
            setCodigo("");
            setNombre("");
            setCategoria("");
            setPrecioVenta("");
            setStock("");
        }

    }, [productoEditar]);

    const manejarSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre || !categoria || !precioVenta || !stock) {
            alert("Completa todos los campos.");
            return;
        }

        const producto: Omit<Producto, "id"> = {
            codigo,
            nombre,
            categoria,
            precioVenta: Number(precioVenta),
            stock: Number(stock)
        };

        onGuardar(producto);
    };

    return (
        <form onSubmit={manejarSubmit}>

            {/* Imagen */}
            <div className="mb-4">
                <label className="form-label fw-bold small text-muted">
                    Imagen del producto
                </label>

                <div
                    className="bg-light border rounded-3 d-flex flex-column justify-content-center align-items-center"
                    style={{
                        height: "150px",
                        borderStyle: "dashed",
                        cursor: "pointer"
                    }}
                >
                    <i className="bi bi-image text-muted fs-2 mb-2"></i>

                    <span className="text-muted small">
                        Haz clic para subir la imagen
                    </span>
                </div>
            </div>

            <div className="row g-3">

                {/* Código */}
                <div className="col-md-6">

                    <label className="form-label fw-bold small text-muted">
                        Código
                    </label>

                    <input
                        type="text"
                        className="form-control bg-light"
                        value={codigo}
                        placeholder="Se genera automáticamente"
                        readOnly
                    />

                </div>

                {/* Categoría */}
                <div className="col-md-6">

                    <label className="form-label fw-bold small text-muted">
                        Categoría
                    </label>

                    <select
                        className="form-select"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <option value="">
                            Seleccionar...
                        </option>

                        <option value="Bebidas Calientes">
                            Bebidas Calientes
                        </option>

                        <option value="Bebidas Frías">
                            Bebidas Frías
                        </option>

                        <option value="Postres">
                            Postres
                        </option>
                    </select>

                </div>

                {/* Nombre */}
                <div className="col-md-12">

                    <label className="form-label fw-bold small text-muted">
                        Nombre del Producto
                    </label>

                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        placeholder="Ej. Empanada..."
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                </div>

                {/* Precio */}
                <div className="col-md-6">

                    <label className="form-label fw-bold small text-muted">
                        Precio de Venta (S/)
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="precioVenta"
                        className="form-control"
                        placeholder="0.00"
                        value={precioVenta}
                        onChange={(e) => setPrecioVenta(e.target.value)}
                        required
                    />

                </div>

                {/* Stock */}
                <div className="col-md-6">

                    <label className="form-label fw-bold small text-muted">
                        Stock Inicial
                    </label>

                    <input
                        type="number"
                        min="0"
                        name="stock"
                        className="form-control"
                        placeholder="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />

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
                    {productoEditar
                        ? "Actualizar Producto"
                        : "Guardar Producto"}
                </button>

            </div>

        </form>
    );
};

export default ProductosForm;