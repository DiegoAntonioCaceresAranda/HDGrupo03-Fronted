import { useEffect, useState } from "react";
import { getHomeDashboardData } from "../services/homeService";
import type { HomeDashboardData } from "../types";

interface UseHomeDashboardResult {
  data: HomeDashboardData | null;
  loading: boolean;
  error: string | null;
}

export function useHomeDashboard(): UseHomeDashboardResult {
  const [data, setData] = useState<HomeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHomeDashboardData()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el resumen del dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
