import React from 'react';

const ProductosForm = () => {
  return (
    <form>
      {/* boton visual para la imagen*/}
      <div className="mb-4 text-center">
        <div className="bg-light border rounded-3 d-flex flex-column justify-content-center align-items-center mb-2 mx-auto" style={{ height: '120px', width: '120px', borderStyle: 'dashed !important' }}>
          <i className="bi bi-image text-muted fs-1"></i>
        </div>
        <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill">
          <i className="bi bi-upload me-1"></i> Subir Imagen
        </button>
        <small className="d-block text-muted mt-1" style={{fontSize: '0.75rem'}}>* Solo demostración visual</small>
      </div>

      <div className="row g-3">
        {/* código(no editable)*/}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Código</label>
          <input type="text" className="form-control bg-light" value="COD-004" readOnly />
        </div>
        
        {/* Nombre del producto */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Nombre del Producto</label>
          <input type="text" name="nombre" className="form-control" placeholder="Ej. Empanada..." required />
        </div>

        {/* PrecioVenta */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Precio de Venta (S/)</label>
          <input type="number" step="0.01" name="precioVenta" className="form-control" placeholder="0.00" required />
        </div>

        {/* Stock-Inicial */}
        <div className="col-md-6">
          <label className="form-label fw-bold small text-muted">Stock Inicial</label>
          <input type="number" name="stock" className="form-control" placeholder="0" required />
        </div>
      </div>
    </form>
  );
};

export default ProductosForm;