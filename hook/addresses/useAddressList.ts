import { useQuery } from "@tanstack/react-query";

import { getAddressList } from "@/services";

export const useAddressList = () => {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: () => getAddressList(1),
    // staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
