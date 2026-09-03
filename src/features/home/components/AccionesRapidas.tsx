import type { FC, ReactElement } from "react";
import { PackagePlus, Truck, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface accionRapida {
  label: string;
  icon: LucideIcon;
  href: string;
}

const acciones: accionRapida[] = [
  { label: "Agregar producto", icon: PackagePlus, href: "/admin/inventory/new" },
  { label: "Ver pedidos pendientes", icon: Truck, href: "/admin/orders?status=pending" },
  { label: "Ver reportes completos", icon: BarChart3, href: "/admin/reports" },
];

const AccionesRapidas: FC = (): ReactElement => (
  <div className="d-flex flex-wrap gap-3">
    {acciones.map(({ label, icon: Icon, href }) => (
      <a
        key={label}
        href={href}
        className="admin-card d-flex align-items-center gap-2 px-4 py-3 rounded-4 border text-decoration-none"
        style={{ color: "var(--admin-primary)", fontWeight: 600, fontSize: 14 }}
      >
        <Icon size={18} />
        {label}
      </a>
    ))}
  </div>
);

export default AccionesRapidas;
