import type { DashboardData, DateRange } from "../types";
import { construirDashboardDesdeVentas } from "../utils/buildDashboardFromVentas";
import { VentaService } from "../../../services/VentaService";

const USE_MOCK_DATA = false;

export async function getDashboardData(range: DateRange): Promise<DashboardData> {
  if (USE_MOCK_DATA) {
    // Si en el futuro activas el mock, aquí puedes retornar datos de prueba
    console.warn("Mock data no habilitada");
  }

  const ventas = await VentaService.listarVentas();
  return construirDashboardDesdeVentas(ventas, range);
}