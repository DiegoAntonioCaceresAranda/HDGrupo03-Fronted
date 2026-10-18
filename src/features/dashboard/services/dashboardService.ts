import api from "../../../config/axios";
import type { DashboardData, DateRange } from "../types";
import { construirDashboardDesdeVentas } from "../utils/buildDashboardFromVentas";
import { VentaService } from "../../../services/VentaService";

export async function getDashboardData(range: DateRange): Promise<DashboardData> {
  try {
    const { data } = await api.get<DashboardData>("/reportes/ventas", {
      params: { rango: range },
    });
    return data;
  } catch (error) {
    console.error("Error al obtener reportes desde FastAPI:", error);
    return construirDashboardDesdeVentas(VentaService.listarVentas(), range);
  }
}