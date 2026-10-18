import { useEffect, useState } from "react";
import { ProductoService, type ProductoPayload } from "../services/ProductoService";
import ProductosForm from "../components/Producto/ProductosForm";
import { type Producto } from "../data/Producto";
import { catergoriaService } from "../services/CategoriaService";
import { type Categoria } from "../data/Categoria";

export const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas las categorías");

  const cargarDatos = async () => {
    const [listaCategorias, listaProductos] = await Promise.all([
      catergoriaService.listarCategorias(),
      ProductoService.obtenerProductosAPI(),
    ]);
    setCategorias(listaCategorias);
    setProductos(listaProductos);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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

  const guardarProducto = async (datos: ProductoPayload) => {
    try {
      if (productoEditar) {
        await ProductoService.actualizarProducto(productoEditar.id, datos);
      } else {
        await ProductoService.crearProducto(datos);
      }
      await cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Ocurrió un error al guardar el producto en el servidor.");
    }
  };

  const eliminarProducto = async (id: number, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar: ${nombre}?`)) {
      try {
        await ProductoService.eliminarProducto(id);
        await cargarDatos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("No se pudo eliminar el producto.");
      }
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas las categorías" ||
      producto.categoria === categoriaFiltro;

    return coincideBusqueda && coincideCategoria;
  });

  const inversionTotal = productos.reduce(
    (total, prod) => total + prod.stock * prod.precioVenta,
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
                <option value="Todas las categorías">
                  Todas las categorías
                </option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA CON IMAGEN DE CLOUDINARY */}
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
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td className="ps-4 fw-bold text-secondary">
                      {producto.codigo}
                    </td>

                    <td>
                      {producto.image_url ? (
                        <img
                          src={producto.image_url}
                          alt={producto.nombre}
                          className="rounded-3 border"
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="bg-light rounded-3 border d-flex align-items-center justify-content-center text-muted"
                          style={{ width: "48px", height: "48px" }}
                        >
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                    </td>

                    <td className="fw-semibold">{producto.nombre}</td>

                    <td>{producto.categoria}</td>

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
                      S/ {producto.precioVenta.toFixed(2)}
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
                          eliminarProducto(producto.id, producto.nombre)
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