import type { FC, ReactElement } from "react";
import { Coffee, ShoppingBag, Bike } from "lucide-react";
import type { TipoOrden } from "../types";

const opciones: { tipo: TipoOrden; icono: typeof Coffee }[] = [
  { tipo: "En Local", icono: Coffee },
  { tipo: "Para Llevar", icono: ShoppingBag },
  { tipo: "Delivery", icono: Bike },
];

interface OrderTypeToggleProps {
  valor: TipoOrden;
  alCambiar: (tipo: TipoOrden) => void;
}

const OrderTypeToggle: FC<OrderTypeToggleProps> = ({ valor, alCambiar }): ReactElement => (
  <div
    className="d-flex align-items-center gap-1 p-1 rounded-pill align-self-start"
    style={{ backgroundColor: "var(--admin-surface-container-low)" }}
  >
    {opciones.map(({ tipo, icono: Icono }) => {
      const activo = valor === tipo;
      return (
        <button
          key={tipo}
          type="button"
          onClick={() => alCambiar(tipo)}
          className="btn rounded-pill px-3 py-2 d-flex align-items-center gap-2"
          style={{
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: activo ? "var(--admin-primary)" : "transparent",
            color: activo ? "#ffffff" : "var(--admin-on-surface-variant)",
            boxShadow: activo ? "0 1px 4px rgba(85,55,34,0.25)" : "none",
          }}
        >
          <Icono size={16} />
          <span>{tipo}</span>
        </button>
      );
    })}
  </div>
);

export default OrderTypeToggle;
