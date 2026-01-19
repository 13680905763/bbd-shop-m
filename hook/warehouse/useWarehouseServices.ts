import { useQuery } from "@tanstack/react-query";

import { getWarehouseServices } from "@/services";

export const useWarehouseServices = () => {
  return useQuery({
    queryKey: ["warehouseServices"],
    queryFn: () => getWarehouseServices(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
