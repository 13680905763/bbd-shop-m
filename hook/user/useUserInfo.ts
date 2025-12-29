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
      console.log("hook获取用户信息");

      return data;
    },
    staleTime: 0, // 每次都视为过期，触发重新请求
    refetchOnMount: true, // 组件挂载时强制请求
    enabled,
  });
};
