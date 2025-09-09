import { useInfiniteQuery } from "@tanstack/react-query";

import { getPackageList } from "@/services";

export function usePackageList(statusCode: string) {
  return useInfiniteQuery({
    queryKey: ["packageList", statusCode],
    queryFn: ({ pageParam = 1 }) => {
      const params: any = {
        current: pageParam,
        size: 10,
        statusCode,
      };

      return getPackageList(params);
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
