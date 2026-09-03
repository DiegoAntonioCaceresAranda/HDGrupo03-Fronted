import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import type { DashboardData, DateRange } from "../types";

interface UseDashboardDataResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  activeRange: DateRange;
  setActiveRange: (range: DateRange) => void;
}

export function useDashboardData(initialRange: DateRange = "Esta semana"): UseDashboardDataResult {
  const [activeRange, setActiveRange] = useState<DateRange>(initialRange);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getDashboardData(activeRange)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar los datos del dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeRange]);

  return { data, loading, error, activeRange, setActiveRange };
}
