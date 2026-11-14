import api from "../config/axios";
import type { Venta } from "../data/Venta";

const mensajeError = (err: any, porDefecto: string): string => {
  const detalle = err?.response?.data?.detail;
  return typeof detalle === "string" ? detalle : porDefecto;
};

export type DatosVenta = Omit<Venta, "id" | "ticket" | "fecha" | "estado"> & {
  pendienteId?: number;
};

const listarVentas = async (): Promise<Venta[]> => {
  const { data } = await api.get<Venta[]>("/api/ventas/");
  return data;
};

const registrarVenta = async (datos: DatosVenta): Promise<Venta> => {
  try {
    const { data } = await api.post<Venta>("/api/ventas/", datos);
    return data;
  } catch (err) {
    throw new Error(mensajeError(err, "No se pudo registrar la venta."));
  }
};

const guardarPendiente = async (datos: DatosVenta): Promise<Venta> => {
  try {
    const { data } = await api.post<Venta>("/api/ventas/pendientes", datos);
    return data;
  } catch (err) {
    throw new Error(mensajeError(err, "No se pudo guardar el pendiente."));
  }
};

const listarPendientes = async (): Promise<Venta[]> => {
  try {
    const { data } = await api.get<Venta[]>("api/ventas/pendientes");
    return data;
  } catch (err) {
    throw new Error(mensajeError(err, "No se pudieron cargar los pendientes."));
  }
};

const cancelarPendiente = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/ventas/${id}`);
  } catch (err) {
    throw new Error(mensajeError(err, "No se pudo cancelar el pendiente."));
  }
};

export const VentaService = {
  listarVentas,
  registrarVenta,
  guardarPendiente,
  listarPendientes,
  cancelarPendiente,
};