import React from 'react';

const ProductosForm = () => {
  return (
    <form>
      {/* Imagen del producto (Diseño ancho y limpio) */}
      <div className="mb-4">
        <label className="form-label fw-bold small text-muted">Imagen del producto</label>
        <div className="bg-light border rounded-3 d-flex flex-column justify-content-center align-items-center" style={{ height: '150px', borderStyle: 'dashed !important', cursor: 'pointer' }}>
          <i className="bi bi-image text-muted fs-2 mb-2"></i>
          <span className="text-muted small">Haz clic para subir la imagen</span>
        </div>
      </div>

      <div className="row g-3">
        {/* Código - Bloqueado */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Código</label>
          <input type="text" className="form-control bg-light" value="COD-004" readOnly />
        </div>
        
        {/* Categoría (El selector que pediste) */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Categoría</label>
          <select className="form-select" required>
            <option value="">Seleccionar...</option>
            <option value="Bebidas Calientes">Bebidas Calientes</option>
            <option value="Bebidas Frías">Bebidas Frías</option>
            <option value="Postres">Postres</option>
          </select>
        </div>

        {/* Nombre */}
        <div className="col-md-12">
          <label className="form-label fw-bold small text-muted">Nombre del Producto</label>
          <input type="text" name="nombre" className="form-control" placeholder="Ej. Empanada..." required />
        </div>

        {/* Precio de Venta y Stock */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Precio de Venta (S/)</label>
          <input type="number" step="0.01" name="precioVenta" className="form-control" placeholder="0.00" required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Stock Inicial</label>
          <input type="number" name="stock" className="form-control" placeholder="0" required />
        </div>
      </div>
    </form>
  );
};

export default ProductosForm;