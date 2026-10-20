import { useEffect, useState } from "react";

import {
  ProductoService,
  type Producto,
  type ProductoForm,
} from "../services/ProductoService";
import ProductosForm from "../components/Producto/ProductosForm";
import { catergoriaService } from "../services/CategoriaService";
import { type Categoria } from "../data/Categoria";

export const ProductosPage = () => {
  // =========================
  // ESTADOS
  // =========================

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // TEMPORAL: las categorías aún vienen de localStorage
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // "" = todas las categorías, si no, el id de la categoría
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // =========================
  // CARGAR PRODUCTOS DESDE FASTAPI
  // =========================

  const cargarProductos = async () => {
    try {
      setError("");
      setProductos(await ProductoService.listarProductos());
    } catch {
      setError("No se pudieron cargar los productos. ¿Está corriendo FastAPI?");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    catergoriaService
      .listarCategorias()
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías."));
  }, []);

  const nombreCategoria = (id: number | null): string =>
    categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";

  // =========================
  // MODAL
  // =========================

  const abrirNuevoProducto = () => {
    setProductoEditar(null);
    setShowModal(true);
  };

  const abrirEditarProducto = (producto: Producto) => {
    setProductoEditar(producto);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setProductoEditar(null);
  };

  // =========================
  // GUARDAR (crear o editar)
  // Si falla, el error sube al formulario y se muestra en el modal
  // =========================

  const guardarProducto = async (datos: ProductoForm) => {
    if (productoEditar) {
      await ProductoService.actualizarProducto(
        productoEditar.id_producto,
        datos,
      );
    } else {
      await ProductoService.crearProducto(datos);
    }

    await cargarProductos();
    cerrarModal();
  };

  // =========================
  // ELIMINAR
  // =========================

  const eliminarProducto = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar: ${nombre}?`)) {
      return;
    }

    try {
      await ProductoService.eliminarProducto(id);
      await cargarProductos();
    } catch (err: any) {
      const detalle = err?.response?.data?.detail;
      alert(
        typeof detalle === "string"
          ? detalle
          : "No se pudo eliminar el producto.",
      );
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.codigo.toLowerCase().includes(texto);

    const coincideCategoria =
      categoriaFiltro === "" ||
      producto.id_categoria === Number(categoriaFiltro);

    return coincideBusqueda && coincideCategoria;
  });

  const inversionTotal = productos.reduce(
    (total, prod) => total + prod.stock * Number(prod.precio_venta),
    0,
  );

  return (
    <div className="container-fluid py-4">
      {/* CABECERA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0 text-dark">Productos</h2>
          <small className="text-muted">
            Gestión de inventario para el modelo de mercado
          </small>
        </div>

        <div>
          <button className="btn btn-outline-secondary me-2">
            <i className="bi bi-file-earmark-pdf me-1"></i>
            PDF
          </button>

          <button
            className="btn btn-dark fw-semibold"
            onClick={abrirNuevoProducto}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Nuevo Producto
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* MÉTRICAS Y FILTROS */}
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
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                className="form-select border-0 bg-light"
                style={{ width: "auto", minWidth: "180px" }}
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0 table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 ps-4 text-muted small fw-bold">CÓDIGO</th>
                <th className="py-3 text-muted small fw-bold">IMAGEN</th>
                <th className="py-3 text-muted small fw-bold">PRODUCTO</th>
                <th className="py-3 text-muted small fw-bold">CATEGORÍA</th>
                <th className="py-3 text-muted small fw-bold">STOCK</th>
                <th className="py-3 text-muted small fw-bold">P. VENTA</th>
                <th className="py-3 pe-4 text-muted small fw-bold text-end">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    Cargando productos...
                  </td>
                </tr>
              ) : productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td className="ps-4 fw-bold text-secondary">
                      {producto.codigo}
                    </td>

                    <td>
                      {producto.image_url ? (
                        <img
                          src={producto.image_url}
                          alt={producto.nombre}
                          className="rounded"
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center text-muted"
                          style={{ width: 48, height: 48 }}
                        >
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                    </td>

                    <td className="fw-semibold">{producto.nombre}</td>

                    <td>{nombreCategoria(producto.id_categoria)}</td>

                    <td>
                      <span
                        className={`badge ${
                          producto.stock < 15 ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {producto.stock}
                      </span>
                    </td>

                    <td className="fw-semibold">
                      S/ {Number(producto.precio_venta).toFixed(2)}
                    </td>

                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => abrirEditarProducto(producto)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          eliminarProducto(producto.id_producto, producto.nombre)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-dark">
                  {productoEditar ? "Editar Producto" : "Nuevo Producto"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                ></button>
              </div>

              <div className="modal-body">
                <ProductosForm
                  productoEditar={productoEditar}
                  categorias={categorias}
                  onGuardar={guardarProducto}
                  onCancelar={cerrarModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};