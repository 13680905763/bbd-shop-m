import { useQuery } from "@tanstack/react-query";

import { getWarehousePreview } from "@/services";

export function useWarehousePreview(key: string) {
  return useQuery({
    queryKey: ["warehousePreview", key],
    queryFn: () => getWarehousePreview(key),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
  });
}
