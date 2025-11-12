import { useInfiniteQuery } from "@tanstack/react-query";

import { getMessageList } from "@/services";

export function useMessageList(statusCode: string) {
  return useInfiniteQuery({
    queryKey: ["messageList", statusCode],

    queryFn: ({ pageParam = 1 }) => {
      const params: any = {
        current: pageParam,
        size: 10,
        statusCode,
        deleteFlag: 1,
      };

      return getMessageList(params);
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
