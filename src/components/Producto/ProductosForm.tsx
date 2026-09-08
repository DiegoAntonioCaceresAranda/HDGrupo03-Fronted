import React, { useEffect, useState } from "react";
import { type Producto } from "../../data/Producto";

interface ProductosFormProps {
  producto?: Producto | null;
  onSave: (datos: Omit<Producto, "id">) => void;
}

const ProductosForm = ({ producto, onSave }: ProductosFormProps) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (producto) {
      setCodigo(producto.codigo);
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setPrecioVenta(producto.precioVenta.toString());
      setStock(producto.stock.toString());
    } else {
      setCodigo("");
      setNombre("");
      setCategoria("");
      setPrecioVenta("");
      setStock("");
    }
  }, [producto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !nombre || !categoria || !precioVenta || !stock) {
      alert("Completa todo loscampos");
      return;
    }

    const producto: Omit<Producto, "id"> = {
      codigo,
      nombre,
      categoria,
      precioVenta: Number(precioVenta),
      stock: Number(stock),
    };

    onSave(producto);
  };

  return (
    <form>
      {/* Imagen del producto (Diseño ancho y limpio) */}
      <div className="mb-4">
        <label className="form-label fw-bold small text-muted">
          Imagen del producto
        </label>
        <div
          className="bg-light border rounded-3 d-flex flex-column justify-content-center align-items-center"
          style={{
            height: "150px",
            borderStyle: "dashed !important",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-image text-muted fs-2 mb-2"></i>
          <span className="text-muted small">
            Haz clic para subir la imagen
          </span>
        </div>
      </div>

      <div className="row g-3">
        {/* Código - Bloqueado */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Código</label>
          <input
            type="text"
            className="form-control bg-light"
            value={codigo}
            placeholder="Se genera automáticamente"
            readOnly
          />
        </div>

        {/* Categoría (El selector que pediste) */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">
            Categoría
          </label>
          <select className="form-select" required>
            <option value="">Seleccionar...</option>
            <option value="Bebidas Calientes">Bebidas Calientes</option>
            <option value="Bebidas Frías">Bebidas Frías</option>
            <option value="Postres">Postres</option>
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
            value={nombre}
            placeholder="Ej. Empanada..."
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        {/* Precio de Venta y Stock */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">
            Precio de Venta (S/)
          </label>
          <input
            type="number"
            step="0.01"
            name="precioVenta"
            className="form-control"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">
            Stock Inicial
          </label>
          <input
            type="number"
            name="stock"
            className="form-control"
            value={stock}
            placeholder="0"
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>
    </form>
  );
};

export default ProductosForm;
