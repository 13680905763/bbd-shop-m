import { useInfiniteQuery } from "@tanstack/react-query";

import { getRefundList } from "@/services/order";

export function useOrderRefundList() {
  return useInfiniteQuery({
    queryKey: ["orderRefundList"],

    queryFn: ({ pageParam = 1 }) => {
      const params: any = {
        current: pageParam,
        size: 10,
      };

      return getRefundList(params);
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    // ❌ 切换标签页不再重新请求
    refetchOnWindowFocus: false,
  });
}
