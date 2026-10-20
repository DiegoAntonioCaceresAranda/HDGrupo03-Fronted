import React, { useEffect, useRef, useState } from "react";
import type {
  Producto,
  ProductoForm as DatosProducto,
} from "../../services/ProductoService";
import { type Categoria } from "../../data/Categoria";

interface ProductosFormProps {
  productoEditar: Producto | null;
  categorias: Categoria[];
  onGuardar: (datos: DatosProducto) => Promise<void>;
  onCancelar: () => void;
}

const ProductosForm: React.FC<ProductosFormProps> = ({
  productoEditar,
  categorias,
  onGuardar,
  onCancelar,
}) => {
  const [nombre, setNombre] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const inputArchivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setIdCategoria(
        productoEditar.id_categoria ? String(productoEditar.id_categoria) : "",
      );
      setPrecioVenta(String(productoEditar.precio_venta));
      setStock(String(productoEditar.stock));
      setVistaPrevia(productoEditar.image_url);
    } else {
      setNombre("");
      setIdCategoria("");
      setPrecioVenta("");
      setStock("");
      setVistaPrevia(null);
    }
    setImagen(null);
    setError("");
  }, [productoEditar]);

  const cambiarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0] ?? null;
    if (!archivo) return;
    setImagen(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !precioVenta || stock === "") {
      setError("Completa nombre, precio y stock.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      await onGuardar({
        nombre: nombre.trim(),
        precio_venta: Number(precioVenta),
        stock: Number(stock),
        id_categoria: idCategoria ? Number(idCategoria) : null,
        imagen,
      });
    } catch (err: any) {
      const detalle = err?.response?.data?.detail;
      setError(
        typeof detalle === "string"
          ? detalle
          : "No se pudo guardar el producto.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      {/* Imagen */}
      <div className="mb-4">
        <label className="form-label fw-bold small text-muted">
          Imagen del producto
        </label>

        <input
          ref={inputArchivo}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={cambiarImagen}
        />

        <div
          className="bg-light border rounded-3 d-flex flex-column justify-content-center align-items-center overflow-hidden"
          style={{ height: "150px", borderStyle: "dashed", cursor: "pointer" }}
          onClick={() => inputArchivo.current?.click()}
        >
          {vistaPrevia ? (
            <img
              src={vistaPrevia}
              alt="Vista previa"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              <i className="bi bi-image text-muted fs-2 mb-2"></i>
              <span className="text-muted small">
                Haz clic para subir la imagen
              </span>
            </>
          )}
        </div>
      </div>

      <div className="row g-3">
        {/* Código (lo genera FastAPI) */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Código</label>
          <input
            type="text"
            className="form-control bg-light"
            value={productoEditar?.codigo ?? ""}
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
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
          >
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre */}
        <div className="col-md-12">
          <label className="form-label fw-bold small text-muted">
            Nombre del Producto
          </label>
          <input
            type="text"
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
            className="form-control"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

      {/* Botones */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-light"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>

        <button type="submit" className="btn btn-dark" disabled={guardando}>
          {guardando
            ? "Guardando..."
            : productoEditar
              ? "Actualizar Producto"
              : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
};

export default ProductosForm;