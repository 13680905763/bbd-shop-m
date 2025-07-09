import { useInfiniteQuery } from "@tanstack/react-query";

import { getWalletDetailList } from "@/services/wallet";

export function useWalletDetailList() {
  return useInfiniteQuery({
    queryKey: ["walletDetailList"],
    queryFn: ({ pageParam = 1 }) => getWalletDetailList(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
