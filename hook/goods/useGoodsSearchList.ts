import { useInfiniteQuery } from "@tanstack/react-query";

import { getGoodsList } from "@/services";

export function useGoodsSearchList(source: string, imageId: string) {
  return useInfiniteQuery({
    queryKey: ["goodsSearchList", source, imageId],
    queryFn: ({ pageParam = 1 }) => {
      const params: any = {
        current: pageParam,
        size: 10,
        source,
        imageId,
      };

      return getGoodsList(params);
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
