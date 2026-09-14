import type { FC, ReactElement } from "react";
import { Check, AlertTriangle } from "lucide-react";

interface SaleToastProps {
  visible: boolean;
  titulo: string;
  mensaje: string;
  tono?: "exito" | "error";
}

const SaleToast: FC<SaleToastProps> = ({ visible, titulo, mensaje, tono = "exito" }): ReactElement => (
  <div
    className="position-fixed d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-lg"
    style={{
      bottom: 24,
      right: 24,
      zIndex: 1080,
      backgroundColor: tono === "exito" ? "var(--admin-primary)" : "#b3261e",
      color: "#ffffff",
      transform: visible ? "translateY(0)" : "translateY(140%)",
      transition: "transform 0.3s ease-out",
      maxWidth: 320,
    }}
  >
    <div
      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
      style={{
        width: 28,
        height: 28,
        backgroundColor: tono === "exito" ? "var(--admin-secondary-container)" : "#fdecea",
        color: tono === "exito" ? "var(--admin-primary)" : "#b3261e",
      }}
    >
      {tono === "exito" ? <Check size={16} /> : <AlertTriangle size={16} />}
    </div>
    <div>
      <h5 className="mb-0" style={{ fontSize: 14, fontWeight: 700 }}>{titulo}</h5>
      <p className="mb-0" style={{ fontSize: 12, opacity: 0.9 }}>{mensaje}</p>
    </div>
  </div>
);

export default SaleToast;
