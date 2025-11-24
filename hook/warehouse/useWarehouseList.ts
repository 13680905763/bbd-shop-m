import { useInfiniteQuery } from "@tanstack/react-query";

import { getWarehouseList } from "@/services";

export function useWarehouseList(statusCode: string) {
  return useInfiniteQuery({
    queryKey: ["warehouseList", statusCode],

    queryFn: ({ pageParam = 1 }) => {
      const params: any = {
        current: pageParam,
        size: 10,
        statusCode,
      };

      return getWarehouseList(params);
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    // ❌ 切换标签页不再重新请求
    refetchOnWindowFocus: false,
  });
}
