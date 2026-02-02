import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { addressApi } from "@/services/addressApi";

export function useAddressList() {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: () => addressApi.listAddress(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
