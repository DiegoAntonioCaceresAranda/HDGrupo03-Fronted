import type { FC, ReactElement } from "react";
import { Wallet, ShoppingBag, Receipt, Truck } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import FiltrarFecha from "../features/dashboard/components/FiltrarFecha";
import StatCard from "../components/ui/StatCard";
import ProductosDestacados from "../features/dashboard/components/ProductosDestacados";
import TransaccionDiariaTabla from "../features/dashboard/components/TransaccionDiariaTabla";
import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";
import { formatoMoneda } from "../features/dashboard/utils/dashboardMetrics";

const PaginaReportes: FC = (): ReactElement => {
  const { data, loading, error, activeRange, setActiveRange } = useDashboardData();

  return (
    <AdminLayout activePath="/admin/reports">
      <div className="admin-page">
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
          <div>
            <h2 className="admin-page-title" style={{ fontFamily: "var(--admin-font-display)", fontSize: 36, fontWeight: 700 }}>
              Reportes de Ventas
            </h2>
            <p className="mt-1 mb-0" style={{ color: "var(--admin-on-surface-variant)", fontSize: 16 }}>
              Revisa tus ingresos y el rendimiento de tus productos.
            </p>
          </div>
          <FiltrarFecha active={activeRange} onChange={setActiveRange} />
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-danger">{error}</p>}

        {data && (
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Ingresos Totales"
                value={formatoMoneda(data.ganancia.total)}
                icon={Wallet}
                percentageChange={data.ganancia.cambioPorcentaje}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Pedidos Totales"
                value={data.pedidos.total.toString()}
                icon={ShoppingBag}
                percentageChange={data.pedidos.cambioPorcentaje}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Ticket Promedio"
                value={formatoMoneda(data.ticketPromedio.cantidad)}
                icon={Receipt}
                percentageChange={data.ticketPromedio.cambioPorcentaje}
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <StatCard
                title="Pendientes de Entrega"
                value={data.deliveryPendiente.contador.toString()}
                icon={Truck}
                caption="pedidos por despachar"
              />
            </div>

            <div className="col-12">
              <ProductosDestacados products={data.productoDestacado} />
            </div>
            <div className="col-12">
              <TransaccionDiariaTabla transacciones={data.transacciones} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PaginaReportes;
