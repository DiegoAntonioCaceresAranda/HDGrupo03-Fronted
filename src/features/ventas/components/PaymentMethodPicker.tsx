import type { FC, ReactElement } from "react";
import { Wallet, CreditCard, QrCode } from "lucide-react";
import type { MetodoPago } from "../types";

const metodos: { metodo: MetodoPago; icono: typeof Wallet; etiqueta: string }[] = [
  { metodo: "Efectivo", icono: Wallet, etiqueta: "Efectivo" },
  { metodo: "Tarjeta", icono: CreditCard, etiqueta: "Tarjeta" },
  { metodo: "QR / Transferencia", icono: QrCode, etiqueta: "QR / Transf" },
];

interface PaymentMethodPickerProps {
  valor: MetodoPago;
  alCambiar: (metodo: MetodoPago) => void;
}

const PaymentMethodPicker: FC<PaymentMethodPickerProps> = ({ valor, alCambiar }): ReactElement => (
  <div className="d-flex flex-column gap-2">
    <span className="text-uppercase" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "var(--admin-on-surface-variant)" }}>
      Método de Pago
    </span>
    <div className="row row-cols-3 g-2">
      {metodos.map(({ metodo, icono: Icono, etiqueta }) => {
        const activo = valor === metodo;
        return (
          <div className="col" key={metodo}>
            <button
              type="button"
              onClick={() => alCambiar(metodo)}
              className="btn w-100 d-flex flex-column align-items-center justify-content-center gap-1 rounded-3 py-2"
              style={{
                backgroundColor: activo ? "var(--admin-primary)" : "var(--admin-surface-container-low)",
                color: activo ? "#ffffff" : "var(--admin-on-surface-variant)",
              }}
            >
              <Icono size={20} />
              <span style={{ fontSize: 11, fontWeight: 700 }}>{etiqueta}</span>
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

export default PaymentMethodPicker;
