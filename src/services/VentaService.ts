import api from "../config/axios";
import type { Venta } from "../data/Venta";

const mensajeError = (err: any, porDefecto: string): string => {
  const detalle = err?.response?.data?.detail;
  return typeof detalle === "string" ? detalle : porDefecto;
};

const listarVentas = async (): Promise<Venta[]> => {
  const { data } = await api.get<Venta[]>("/ventas/");
  return data;
};

const registrarVenta = async (
  datos: Omit<Venta, "id" | "ticket" | "fecha">,
): Promise<Venta> => {
  try {
    const { data } = await api.post<Venta>("/ventas/", datos);
    return data;
  } catch (err) {
    throw new Error(mensajeError(err, "No se pudo registrar la venta."));
  }
};

export const VentaService = {
  listarVentas,
  registrarVenta,
};