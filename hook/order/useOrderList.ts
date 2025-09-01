import { useInfiniteQuery } from "@tanstack/react-query";

import { getOrderList } from "@/services/order";

export function useOrderList(customerPayStatusCode: string) {
  return useInfiniteQuery({
    queryKey: ["orderList", customerPayStatusCode],

    queryFn: ({ pageParam = 1 }) => {
      const params: any = {
        current: pageParam,
        size: 10,
        customerPayStatusCode,
      };

      if (customerPayStatusCode === "201") {
        params.statusCode = "101";
      }

      return getOrderList(params);
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
