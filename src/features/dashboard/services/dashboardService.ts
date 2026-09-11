import type { DashboardData, DateRange } from "../types";
import { getMockDashboardData } from "./mockData";
import { construirDashboardDesdeVentas } from "../utils/buildDashboardFromVentas";
import { VentaService } from "../../../services/VentaService";

const USE_MOCK_DATA = false;

export async function getDashboardData(range: DateRange): Promise<DashboardData> {
  if (USE_MOCK_DATA) {
    return getMockDashboardData(range);
  }

  return construirDashboardDesdeVentas(VentaService.listarVentas(), range);
}
