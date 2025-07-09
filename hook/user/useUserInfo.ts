// /hooks/user/useUserInfo.ts
import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/services";
import { useUserStore } from "@/store";

export const useUserInfo = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const data = await getUserInfo();

      // ✅ 在 queryFn 中做副作用（例如写入 Zustand）
      useUserStore.getState().setUser(data);

      return data;
    },
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    enabled,
  });
};
