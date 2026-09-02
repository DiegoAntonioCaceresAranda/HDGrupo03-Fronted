import React, { useState } from 'react';
import productosMock from '../data/Producto';
import ProductosForm from '../components/Producto/ProductosForm';

export const ProductosPage = () => {
  // Estado para ver el modal
  const [showModal, setShowModal] = useState(false);

  const inversionTotal = productosMock.reduce((total, prod) => total + (prod.stock * prod.precioVenta), 0);

  return (
    <div className="container mt-4">
      
      {/* Cabecera */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0">Collins Café <span className="text-secondary fw-normal">/ Productos</span></h2>
          <small className="text-muted">Gestión de inventario para el modelo de mercado</small>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2">
            <i className="bi bi-file-earmark-pdf me-1"></i> PDF
          </button>
          {/* boton para encender el modal */}
          <button className="btn btn-cafe fw-semibold" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tarjetas y Filtros */}
      <div className="row mb-4">
        {/* Lado Izquierdo: metricas */}
        <div className="col-md-5 d-flex gap-3 mb-3 mb-md-0">
           <div className="card shadow-sm flex-fill border-0 rounded-4">
             <div className="card-body py-3 d-flex align-items-center">
               <div className="bg-cafe-light p-3 rounded-3 me-3 text-cafe">
                 <i className="bi bi-layers fs-3"></i>
               </div>
               <div>
                 <small className="text-muted fw-bold d-block" style={{letterSpacing: '1px'}}>ITEMS</small>
                 <h4 className="mb-0 fw-bold">{productosMock.length}</h4>
               </div>
             </div>
           </div>
           
           <div className="card shadow-sm flex-fill border-0 rounded-4">
             <div className="card-body py-3 d-flex align-items-center">
               <div className="bg-cafe-light p-3 rounded-3 me-3 text-cafe">
                 <i className="bi bi-cash-coin fs-3"></i>
               </div>
               <div>
                 <small className="text-muted fw-bold d-block" style={{letterSpacing: '1px'}}>INVERSIÓN</small>
                 <h4 className="mb-0 fw-bold text-cafe">S/ {inversionTotal.toFixed(2)}</h4>
               </div>
             </div>
           </div>
        </div>

        {/* Lado Derecho: Buscador */}
        <div className="col-md-7 d-flex">
          <div className="card shadow-sm border-0 rounded-4 w-100">
            <div className="card-body py-2 d-flex flex-column flex-md-row align-items-center gap-3 h-100">
              <div className="input-group flex-grow-1">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input type="text" className="form-control bg-light border-0" placeholder="Buscar por nombre o código..." />
              </div>
              <div className="vr d-none d-md-block text-muted"></div>
              <select className="form-select border-0 text-cafe fw-semibold bg-transparent" style={{ width: 'auto', minWidth: '180px' }}>
                <option>Todas las categorías</option>
                <option>Bebidas Calientes</option>
                <option>Postres</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 ps-4 text-muted small fw-bold">#</th>
                <th className="py-3 text-muted small fw-bold">CÓDIGO</th>
                <th className="py-3 text-muted small fw-bold">PRODUCTO</th>
                <th className="py-3 text-muted small fw-bold">CATEGORÍA</th>
                <th className="py-3 text-muted small fw-bold">STOCK</th>
                <th className="py-3 text-muted small fw-bold">P. VENTA</th>
                <th className="py-3 pe-4 text-muted small fw-bold text-end">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productosMock.map((producto, index) => (
                <tr key={producto.id}>
                  <td className="ps-4 text-muted">{index + 1}</td>
                  <td className="fw-bold text-secondary">{producto.codigo}</td>
                  <td className="fw-semibold">{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>
                    <span className={`badge rounded-pill ${producto.stock < 15 ? 'bg-danger' : 'bg-success'}`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td className="fw-semibold">S/ {producto.precioVenta.toFixed(2)}</td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-outline-cafe text-uppercase" style={{fontSize: '0.75rem', fontWeight: 'bold'}}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Producto */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-cafe">
                  <i className="bi bi-box-seam me-2"></i>Nuevo Producto
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Aquí inyectamos desde: (components/) */}
                <ProductosForm />
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-cafe rounded-pill px-4">
                  <i className="bi bi-cloud-arrow-up me-2"></i>Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};