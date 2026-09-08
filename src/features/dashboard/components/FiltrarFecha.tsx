import type { FC, ReactElement } from "react";
import type { DateRange } from "../types";

const dateRanges: DateRange[] = ["Hoy", "Esta semana", "Este mes"];

interface FiltrarFechaProps {
  active: DateRange;
  onChange: (range: DateRange) => void;
}

const FiltrarFecha: FC<FiltrarFechaProps> = ({ active, onChange }): ReactElement => (
  <div className="d-flex p-1 rounded align-self-start" style={{ backgroundColor: "var(--admin-surface-container-low)" }}>
    {dateRanges.map((range) => (
      <button
        key={range}
        onClick={() => onChange(range)}
        className={`btn admin-range-btn px-3 py-2 rounded ${active === range ? "admin-range-active" : ""}`}
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: active === range ? "var(--admin-primary)" : "var(--admin-on-surface-variant)",
          backgroundColor: active === range ? "var(--admin-surface)" : "transparent",
          boxShadow: active === range ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {range}
      </button>
    ))}
  </div>
);

export default FiltrarFecha;
