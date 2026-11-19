import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";

import {
  ProductoService,
  type Producto,
  type ProductoForm,
} from "../services/ProductoService";
import ProductosForm from "../components/Producto/ProductosForm";
import { catergoriaService } from "../services/CategoriaService";
import { type Categoria } from "../data/Categoria";
import SaleToast from "../features/ventas/components/SaleToast";
import "../styles/pos.css";

const mensajeError = (error: unknown, porDefecto: string): string => {
  if (isAxiosError(error)) {
    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }
  return porDefecto;
};

export const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // "" = todas las categorías, si no, el id de la categoría
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // Confirmación de eliminación
  const [porEliminar, setPorEliminar] = useState<Producto | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    titulo: string;
    mensaje: string;
    tono: "exito" | "error";
  }>({ visible: false, titulo: "", mensaje: "", tono: "exito" });
  const [animando, setAnimando] = useState(false);
  const temporizadorToast = useRef<ReturnType<typeof setTimeout> | null>(null);
  const temporizadorAnim = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrarToast = useCallback(
    (titulo: string, mensaje: string, tono: "exito" | "error" = "exito") => {
      if (temporizadorToast.current) clearTimeout(temporizadorToast.current);
      setToast({ visible: true, titulo, mensaje, tono });
      temporizadorToast.current = setTimeout(() => {
        setToast((anterior) => ({ ...anterior, visible: false }));
      }, 3000);

      if (tono === "exito") {
        if (temporizadorAnim.current) clearTimeout(temporizadorAnim.current);
        setAnimando(true);
        temporizadorAnim.current = setTimeout(() => setAnimando(false), 1000);
      }
    },
    [],
  );

  // Recarga la lista (se usa después de crear o editar)
  const cargarProductos = async () => {
    try {
      setError("");
      setProductos(await ProductoService.listarProductos());
    } catch {
      setError("No se pudieron cargar los productos. ¿Está corriendo FastAPI?");
    }
  };

  // Carga inicial
  useEffect(() => {
    let activo = true;

    ProductoService.listarProductos()
      .then((datos) => {
        if (activo) setProductos(datos);
      })
      .catch(() => {
        if (activo) {
          setError(
            "No se pudieron cargar los productos. ¿Está corriendo FastAPI?",
          );
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    catergoriaService
      .listarCategorias()
      .then((datos) => {
        if (activo) setCategorias(datos);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar las categorías.");
      });

    return () => {
      activo = false;
    };
  }, []);

  const nombreCategoria = (id: number | null): string =>
    categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";

  // MODAL
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

  // GUARDAR (crear o editar)
  // Si falla, el error sube al formulario y se muestra en el modal
  const guardarProducto = async (datos: ProductoForm) => {
    const editando = productoEditar !== null;

    if (productoEditar) {
      await ProductoService.actualizarProducto(
        productoEditar.id_producto,
        datos,
      );
    } else {
      await ProductoService.crearProducto(datos);
    }

    // Cierra el formulario al instante y avisa
    cerrarModal();
    mostrarToast(
      editando ? "Producto actualizado" : "Producto creado",
      editando
        ? "Los cambios se guardaron correctamente."
        : "El producto se registró correctamente.",
    );

    // La lista se refresca en segundo plano
    void cargarProductos();
  };

  // ELIMINAR
  const confirmarEliminacion = async () => {
    if (!porEliminar) return;
    const { id_producto, nombre } = porEliminar;

    setEliminando(true);
    try {
      await ProductoService.eliminarProducto(id_producto);
      setProductos((anterior) =>
        anterior.filter((p) => p.id_producto !== id_producto),
      );
      setPorEliminar(null);
      mostrarToast("Producto eliminado", `"${nombre}" fue eliminado.`);
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      setPorEliminar(null);
      mostrarToast(
        "No se pudo eliminar",
        mensajeError(err, "No se pudo eliminar el producto."),
        "error",
      );
    } finally {
      setEliminando(false);
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
                        onClick={() => setPorEliminar(producto)}
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

      {/* MODAL FORMULARIO */}
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

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {porEliminar && (
        <div
          className="d-flex align-items-center justify-content-center p-3"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2100,
            backgroundColor: "rgba(60, 40, 25, 0.45)",
          }}
          onClick={() => !eliminando && setPorEliminar(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-4 text-center"
            style={{
              width: "100%",
              maxWidth: 400,
              animation: "checkPop 0.25s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#f1e4d1",
                color: "var(--admin-primary, #6f4e37)",
                fontSize: 28,
              }}
            >
              <i className="bi bi-trash"></i>
            </div>
            <h5
              className="fw-bold mb-2"
              style={{ color: "var(--admin-primary, #6f4e37)" }}
            >
              ¿Eliminar producto?
            </h5>
            <p className="text-muted mb-4" style={{ fontSize: 14 }}>
              Vas a eliminar <strong>"{porEliminar.nombre}"</strong>. Esta
              acción no se puede deshacer.
            </p>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn flex-fill rounded-pill fw-semibold"
                style={{
                  backgroundColor: "#f1e4d1",
                  color: "var(--admin-primary, #6f4e37)",
                }}
                disabled={eliminando}
                onClick={() => setPorEliminar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn flex-fill rounded-pill fw-semibold"
                style={{
                  backgroundColor: "var(--admin-primary, #6f4e37)",
                  color: "#ffffff",
                }}
                disabled={eliminando}
                onClick={confirmarEliminacion}
              >
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMACIÓN DE ÉXITO */}
      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {animando && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            pointerEvents: "none",
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{
              width: 96,
              height: 96,
              backgroundColor: "var(--admin-primary, #6f4e37)",
              color: "#ffffff",
              fontSize: 52,
              animation: "checkPop 0.4s ease-out",
            }}
          >
            <i className="bi bi-check-lg"></i>
          </div>
        </div>
      )}

      <SaleToast
        visible={toast.visible}
        titulo={toast.titulo}
        mensaje={toast.mensaje}
        tono={toast.tono}
      />
    </div>
  );
};