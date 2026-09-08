import type { FC, ReactElement } from "react";

export type BadgeTone = "exito" | "pendiente" | "error";

interface StatusIndicadorProps {
  label: string;
  tone: BadgeTone;
}

const toneStyles: Record<BadgeTone, { bg: string; color: string }> = {
  exito: { bg: "color-mix(in srgb, var(--admin-secondary-fixed) 80%, transparent)", color: "var(--admin-secondary)" },
  pendiente: { bg: "color-mix(in srgb, var(--admin-tertiary-fixed) 80%, transparent)", color: "var(--admin-tertiary)" },
  error: { bg: "#fdecea", color: "#b3261e" },
};


const StatusIndicador: FC<StatusIndicadorProps> = ({ label, tone }): ReactElement => {
  const { bg, color } = toneStyles[tone];
  return (
    <span
      className="badge rounded-pill fw-bold"
      style={{ backgroundColor: bg, color, fontFamily: "var(--admin-font-body)", fontSize: 11 }}
    >
      {label}
    </span>
  );
};

export default StatusIndicador;
