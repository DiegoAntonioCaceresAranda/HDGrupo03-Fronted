import api from "../../../config/axios";
import type { DashboardData, DateRange } from "../types";
import { getMockDashboardData } from "./mockData";

const rangeToParam: Record<DateRange, string> = {
  Hoy: "today",
  "Esta semana": "week",
  "Este mes": "month",
};

const USE_MOCK_DATA = true;

export async function getDashboardData(range: DateRange): Promise<DashboardData> {
  if (USE_MOCK_DATA) {
    return getMockDashboardData(range);
  }

  const { data } = await api.get<DashboardData>("/dashboard", {
    params: { range: rangeToParam[range] },
  });
  return data;
}
