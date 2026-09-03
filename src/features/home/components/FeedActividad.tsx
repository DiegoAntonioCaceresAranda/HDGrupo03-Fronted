import type { FC, ReactElement } from "react";
import { ShoppingCart, UserPlus, PackageMinus, Clock } from "lucide-react";
import type { ActivityItem as ItemActividad, ActivityType } from "../types";

interface FeedActividadProps {
  items: ItemActividad[];
}

const iconByType: Record<ActivityType, typeof ShoppingCart> = {
  order: ShoppingCart,
  customer: UserPlus,
  stock: PackageMinus,
};

const FeedActividad: FC<FeedActividadProps> = ({ items }): ReactElement => (
  <div className="admin-card rounded-4 border h-100 d-flex flex-column">
    <div className="p-4 border-bottom d-flex align-items-center gap-2">
      <Clock size={20} color="var(--admin-primary)" />
      <h3 style={{ fontFamily: "var(--admin-font-display)", fontSize: 20, fontWeight: 600, color: "var(--admin-on-surface)" }}>
        Actividad reciente
      </h3>
    </div>

    <ul className="list-unstyled mb-0">
      {items.map((item) => {
        const Icon = iconByType[item.type];
        return (
          <li
            key={item.id}
            className="d-flex align-items-start gap-3 px-4 py-3 border-bottom"
            style={{ borderColor: "var(--admin-surface-container-low)" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
              style={{ width: 32, height: 32, backgroundColor: "var(--admin-secondary-container)" }}
            >
              <Icon size={16} color="var(--admin-secondary)" />
            </div>
            <div>
              <div style={{ fontSize: 14, color: "var(--admin-on-surface)" }}>{item.message}</div>
              <div style={{ fontSize: 12, color: "var(--admin-on-surface-variant)" }}>{item.time}</div>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export default FeedActividad;
