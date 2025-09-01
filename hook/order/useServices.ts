// /hooks/user/useUserInfo.ts
import { useQuery } from "@tanstack/react-query";

import { getServicesList } from "@/services";
import { useServicesStore } from "@/store";

export const useServices = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const data = await getServicesList();

      // ✅ 在 queryFn 中做副作用（例如写入 Zustand）
      useServicesStore.getState().setServices(data);

      return data;
    },
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    enabled,
  });
};
