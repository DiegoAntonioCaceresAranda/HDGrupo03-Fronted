import { useEffect, useState, type FC, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { VentaService } from "../services/VentaService";
import type { Venta } from "../data/Venta";

const moneda = (monto: number) => `S/ ${monto.toFixed(2)}`;

const PaginaVentasPendientes: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  const cargar = async () => {
    try {
      setError(null);
      setPendientes(await VentaService.listarPendientes());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron cargar los pendientes.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const retomar = (venta: Venta) => {
    navigate("/admin/ventas", { state: { pendiente: venta } });
  };

  const cancelar = async (venta: Venta) => {
    if (!window.confirm(`¿Cancelar el pendiente #${venta.ticket}?`)) return;
    setCancelandoId(venta.id);
    try {
      await VentaService.cancelarPendiente(venta.id);
      setPendientes((prev) => prev.filter((p) => p.id !== venta.id));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cancelar el pendiente.",
      );
    } finally {
      setCancelandoId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card rounded-4 p-4 border d-flex flex-column flex-sm-row justify-content-between gap-3 mb-4">
        <div>
          <span
            className="text-uppercase"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.4,
              color: "var(--admin-primary)",
            }}
          >
            Caja Principal
          </span>

          <h1
            className="mb-0 mt-1"
            style={{
              fontFamily: "var(--admin-font-display)",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--admin-primary)",
            }}
          >
            Ventas Pendientes
          </h1>

          <p
            className="mb-0 mt-1"
            style={{ fontSize: 14, color: "var(--admin-on-surface-variant)" }}
          >
            Elige una orden para retomarla en el punto de venta.
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark rounded-pill px-3"
            onClick={() => navigate("/admin/ventas")}
          >
            ← Volver al punto de venta
          </button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {cargando && <p>Cargando...</p>}

      {!cargando && pendientes.length === 0 && !error && (
        <div className="admin-card rounded-4 p-4 border text-center">
          <p
            className="mb-0"
            style={{ color: "var(--admin-on-surface-variant)" }}
          >
            Aún no hay ventas pendientes.
          </p>
        </div>
      )}

      <div className="row g-4">
        {pendientes.map((venta) => (
          <div key={venta.id} className="col-12 col-md-6 col-xl-4">
            <div className="admin-card rounded-4 p-4 border h-100 d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div
                    style={{
                      fontFamily: "var(--admin-font-display)",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "var(--admin-primary)",
                    }}
                  >
                    Ticket #{venta.ticket}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--admin-on-surface-variant)",
                    }}
                  >
                    {new Date(venta.fecha).toLocaleString("es-PE")}
                  </div>
                </div>
                <span className="badge rounded-pill text-bg-warning">
                  {venta.tipoOrden}
                </span>
              </div>

              <div style={{ fontSize: 13 }}>
                <div>
                  <strong>Cliente:</strong> {venta.cliente || "Sin nombre"}
                </div>
                <div>
                  <strong>Ubicación:</strong> {venta.ubicacion || "-"}
                </div>
              </div>

              <ul className="list-unstyled mb-0 flex-grow-1" style={{ fontSize: 13 }}>
                {venta.items.map((item) => (
                  <li
                    key={item.productoId}
                    className="d-flex justify-content-between"
                  >
                    <span>
                      {item.cantidad}x {item.nombre}
                    </span>
                    <span>{moneda(item.cantidad * item.precioUnitario)}</span>
                  </li>
                ))}
              </ul>

              <div
                className="d-flex justify-content-between align-items-center border-top pt-3"
                style={{ fontWeight: 700 }}
              >
                <span>Total</span>
                <span style={{ fontSize: 18 }}>{moneda(venta.total)}</span>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm flex-grow-1 rounded-pill fw-semibold"
                  style={{
                    backgroundColor: "var(--admin-primary)",
                    color: "#ffffff",
                  }}
                  onClick={() => retomar(venta)}
                >
                  Retomar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  disabled={cancelandoId === venta.id}
                  onClick={() => cancelar(venta)}
                >
                  {cancelandoId === venta.id ? "..." : "Cancelar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginaVentasPendientes;