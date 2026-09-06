import React, { useState } from 'react';
import { ProductoService } from '../services/ProductoService';
import ProductosForm from '../components/Producto/ProductosForm';

import AdminLayout from '../components/ui/AdminLayout';

export const ProductosPage = () => {
  //capa de servicio para obtener los datos
  const [productos, setProductos] = useState(ProductoService.obtenerTodos());
  const [showModal, setShowModal] = useState(false);

  const eliminarProducto = (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar: ${nombre}?`)) {

      //el servicio se encarga de la lógica de eliminacion
      const nuevaLista = ProductoService.eliminar(id);
      setProductos(nuevaLista);
    }
  };

  const inversionTotal = productos.reduce((total, prod) => total + (prod.stock * prod.precioVenta), 0);

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-0 text-dark">Productos</h2>
            <small className="text-muted">Gestión de inventario para el modelo de mercado</small>
          </div>
          <div>
            <button className="btn btn-outline-secondary me-2">
              <i className="bi bi-file-earmark-pdf me-1"></i> PDF
            </button>
            <button className="btn btn-dark fw-semibold" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
            </button>
          </div>
        </div>

        {/*tarjeta de metricas */}
        <div className="row mb-4">
          <div className="col-md-5 d-flex gap-3 mb-3 mb-md-0">
             <div className="card shadow-sm flex-fill border-0">
               <div className="card-body py-3 d-flex align-items-center">
                 <div className="bg-light p-3 rounded-3 me-3 text-dark">
                   <i className="bi bi-layers fs-3"></i>
                 </div>
                 <div>
                   <small className="text-muted fw-bold d-block">ITEMS</small>
                   <h4 className="mb-0 fw-bold">{productos.length}</h4>
                 </div>
               </div>
             </div>
             
             <div className="card shadow-sm flex-fill border-0">
               <div className="card-body py-3 d-flex align-items-center">
                 <div className="bg-light p-3 rounded-3 me-3 text-dark">
                   <i className="bi bi-cash-coin fs-3"></i>
                 </div>
                 <div>
                   <small className="text-muted fw-bold d-block">INVERSIÓN</small>
                   <h4 className="mb-0 fw-bold">S/ {inversionTotal.toFixed(2)}</h4>
                 </div>
               </div>
             </div>
          </div>

          <div className="col-md-7 d-flex">
            <div className="card shadow-sm border-0 w-100">
              <div className="card-body py-2 d-flex flex-column flex-md-row align-items-center gap-3 h-100">
                <input type="text" className="form-control bg-light border-0" placeholder="Buscar producto..." />
                <select className="form-select border-0 bg-light" style={{ width: 'auto', minWidth: '180px' }}>
                  <option>Todas las categorías</option>
                  <option>Bebidas Calientes</option>
                  <option>Bebidas Frías</option>
                  <option>Postres</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/*tabla*/}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0 table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 ps-4 text-muted small fw-bold">CÓDIGO</th>
                  <th className="py-3 text-muted small fw-bold">PRODUCTO</th>
                  <th className="py-3 text-muted small fw-bold">CATEGORÍA</th>
                  <th className="py-3 text-muted small fw-bold">STOCK</th>
                  <th className="py-3 text-muted small fw-bold">P. VENTA</th>
                  <th className="py-3 pe-4 text-muted small fw-bold text-end">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="ps-4 fw-bold text-secondary">{producto.codigo}</td>
                    <td className="fw-semibold">{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>
                      <span className={`badge ${producto.stock < 15 ? 'bg-danger' : 'bg-success'}`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td className="fw-semibold">S/ {producto.precioVenta.toFixed(2)}</td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-outline-dark me-2" onClick={() => setShowModal(true)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(producto.id, producto.nombre)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/*modal*/}
        {showModal && (
          <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold text-dark">Gestión de Producto</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <ProductosForm />
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="button" className="btn btn-dark">Guardar Producto</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};