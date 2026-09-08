import type { FC, ReactElement } from "react";
import { DollarSign, ShoppingBag, UserPlus } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/ui/StatCard";
import AccionesRapidas from "../features/home/components/AccionesRapidas";
import ListaOrdenes from "../features/home/components/ListaOrdenes";
import AlertaStock from "../features/home/components/AlertaStock";
import FeedActividad from "../features/home/components/FeedActividad";
import { useHomeDashboard } from "../features/home/hooks/useHomeDashboard";
import { formatoMoneda } from "../features/dashboard/utils/dashboardMetrics";

const PaginaDashboard: FC = (): ReactElement => {
  const { data, loading, error } = useHomeDashboard();

  return (
    <AdminLayout activePath="/admin">
      <div className="admin-page">
        <div className="mb-4">
          <h2 className="admin-page-title" style={{ fontFamily: "var(--admin-font-display)", fontSize: 36, fontWeight: 700 }}>
            Dashboard
          </h2>
          <p className="mt-1 mb-0" style={{ color: "var(--admin-on-surface-variant)", fontSize: 16 }}>
            Un vistazo rápido a lo que está pasando hoy en tu tienda.
          </p>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-danger">{error}</p>}

        {data && (
          <div className="d-flex flex-column gap-4">
            <AccionesRapidas />

            <div className="row g-4">
              <div className="col-12 col-sm-4">
                <StatCard title="Ventas de hoy" value={formatoMoneda(data.quickStats.todaySales)} icon={DollarSign} caption="acumulado del día" />
              </div>
              <div className="col-12 col-sm-4">
                <StatCard title="Pedidos de hoy" value={data.quickStats.todayOrders.toString()} icon={ShoppingBag} caption="recibidos hoy" />
              </div>
              <div className="col-12 col-sm-4">
                <StatCard title="Clientes nuevos" value={data.quickStats.newCustomersToday.toString()} icon={UserPlus} caption="registrados hoy" />
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <ListaOrdenes orders={data.attentionOrders} />
              </div>
              <div className="col-12 col-lg-6">
                <AlertaStock products={data.lowStockProducts} />
              </div>
            </div>

            <FeedActividad items={data.activity} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PaginaDashboard;
