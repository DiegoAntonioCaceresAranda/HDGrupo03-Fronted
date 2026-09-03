import { useMemo, useState } from "react";

interface UseAdminPaginationResult<T> {
  itemsVisibles: T[];
  hayMas: boolean;
  cargarMas: () => void;
  reset: () => void;
}

export function useAdminPagination<T>(items: T[], pageSize = 10): UseAdminPaginationResult<T> {
  const [campoVisible, setCampoVisible] = useState(pageSize);

  const itemsVisibles = useMemo(() => items.slice(0, campoVisible), [items, campoVisible]);
  const hayMas = campoVisible < items.length;

  return {
    itemsVisibles,
    hayMas,
    cargarMas: () => setCampoVisible((c) => c + pageSize),
    reset: () => setCampoVisible(pageSize),
  };
}
