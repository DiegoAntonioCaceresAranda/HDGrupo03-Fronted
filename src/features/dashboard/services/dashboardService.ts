import api from "../../../config/axios";
import type { DashboardData, DateRange } from "../types";

export async function getDashboardData(range: DateRange): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("api/reportes/ventas", {
    params: { rango: range },
  });
  return data;
}