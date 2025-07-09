import { useInfiniteQuery } from "@tanstack/react-query";

import { getOrderList } from "@/services/order";

export function useOrderList(customerPayStatusCode: string) {
  return useInfiniteQuery({
    queryKey: ["orderList", customerPayStatusCode],
    queryFn: ({ pageParam = 1 }) =>
      getOrderList({ current: pageParam, size: 10, customerPayStatusCode }),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
