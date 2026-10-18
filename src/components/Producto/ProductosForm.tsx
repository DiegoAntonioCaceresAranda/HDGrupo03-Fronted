import React, { useEffect, useRef, useState } from "react";
import { type Producto } from "../../data/Producto";
import { type Categoria } from "../../data/Categoria";
import { catergoriaService } from "../../services/CategoriaService";
import { type ProductoPayload } from "../../services/ProductoService";

interface ProductosFormProps {
  productoEditar: Producto | null;
  onGuardar: (producto: ProductoPayload) => void;
  onCancelar: () => void;
}

const ProductosForm: React.FC<ProductosFormProps> = ({
  productoEditar,
  onGuardar,
  onCancelar,
}) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");

  // Estados para la imagen de Cloudinary
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    catergoriaService.listarCategorias().then((lista) => {
      setCategorias(lista);
      if (!productoEditar && lista.length > 0) {
        setIdCategoria(String(lista[0].id));
      }
    });
  }, [productoEditar]);

  useEffect(() => {
    if (productoEditar) {
      setCodigo(productoEditar.codigo);
      setNombre(productoEditar.nombre);
      setIdCategoria(
        productoEditar.id_categoria ? String(productoEditar.id_categoria) : "",
      );
      setPrecioVenta(productoEditar.precioVenta.toString());
      setStock(productoEditar.stock.toString());
      setPreviewUrl(productoEditar.image_url || null);
      setImagenArchivo(null);
    } else {
      setCodigo("");
      setNombre("");
      setPrecioVenta("");
      setStock("");
      setPreviewUrl(null);
      setImagenArchivo(null);
    }
  }, [productoEditar]);

  const manejarCambioImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenArchivo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !idCategoria || !precioVenta || !stock) {
      alert("Completa todos los campos.");
      return;
    }

    onGuardar({
      nombre,
      precioVenta: Number(precioVenta),
      stock: Number(stock),
      id_categoria: Number(idCategoria),
      imagen: imagenArchivo,
    });
  };

  return (
    <form onSubmit={manejarSubmit}>
      {/* Selector de Imagen conectado a Cloudinary */}
      <div className="mb-4">
        <label className="form-label fw-bold small text-muted">
          Imagen del producto
        </label>

        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="image/*"
          onChange={manejarCambioImagen}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="bg-light border rounded-3 d-flex flex-column justify-content-center align-items-center overflow-hidden position-relative"
          style={{
            height: "160px",
            borderStyle: "dashed",
            cursor: "pointer",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Vista previa"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
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
        {imagenArchivo && (
          <small className="text-success d-block mt-1">
            Archivo seleccionado: {imagenArchivo.name}
          </small>
        )}
      </div>

      <div className="row g-3">
        {/* Código */}
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

        {/* Categoría */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">
            Categoría
          </label>
          <select
            className="form-select"
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
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
            name="nombre"
            className="form-control"
            placeholder="Ej. Café Capuchino..."
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

        <button type="submit" className="btn btn-dark">
          {productoEditar ? "Actualizar Producto" : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
};

export default ProductosForm;