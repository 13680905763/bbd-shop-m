// /hooks/user/useUserInfo.ts
import { useQuery } from "@tanstack/react-query";

import { useWalletStore } from "@/store";
import { getWalletInfo } from "@/services/wallet";

export const useWalletInfo = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: async () => {
      const data = await getWalletInfo();

      // ✅ 在 queryFn 中做副作用（例如写入 Zustand）
      useWalletStore.getState().setWallet(data);

      return data;
    },
    staleTime: 0, // 每次都视为过期，触发重新请求
    refetchOnMount: true, // 组件挂载时强制请求
    enabled,
  });
};
