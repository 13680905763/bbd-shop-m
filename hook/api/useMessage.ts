import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";
import { messageApi } from "@/services";

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

      return messageApi.listMessage(params);
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
export function useReadMessage() {
  return useMutation({
    mutationFn: (id: string) => messageApi.readMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
  });
}
export function useDeleteMessage() {
  return useMutation({
    mutationFn: (ids: number[]) => messageApi.deleteMessage(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageList"] });
    },
  });
}
