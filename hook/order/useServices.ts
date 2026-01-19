import { useQuery } from "@tanstack/react-query";

import { getServicesList } from "@/services";

export const useServices = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const data = await getServicesList();

      return data;
    },
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    enabled,
  });
};
