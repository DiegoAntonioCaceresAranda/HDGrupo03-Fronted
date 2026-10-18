import api from "../../../config/axios";
import type { HomeDashboardData } from "../types";

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const { data } = await api.get<HomeDashboardData>("/dashboard");
  return data;
}