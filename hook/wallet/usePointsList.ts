import { useInfiniteQuery } from "@tanstack/react-query";

import { getPointsList } from "@/services";

export function usePointsList() {
  return useInfiniteQuery({
    queryKey: ["pointsList"],
    queryFn: ({ pageParam = 1 }) => getPointsList(),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
