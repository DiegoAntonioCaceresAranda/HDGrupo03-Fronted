import { useMemo, useState } from "react";

interface UseAdminPaginationResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export function useAdminPagination<T>(items: T[], pageSize = 10): UseAdminPaginationResult<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    hasMore,
    loadMore: () => setVisibleCount((c) => c + pageSize),
    reset: () => setVisibleCount(pageSize),
  };
}
