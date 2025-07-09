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
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    enabled,
  });
};
