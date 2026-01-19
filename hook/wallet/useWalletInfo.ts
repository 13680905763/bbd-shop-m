import { useQuery } from "@tanstack/react-query";

import { getWalletInfo } from "@/services/wallet";

export const useWalletInfo = () => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: getWalletInfo,
    staleTime: 0, // 每次都视为过期，触发重新请求
    refetchOnMount: true, // 进入页面检查更新
    refetchOnWindowFocus: true, // 切回标签页刷新
    refetchOnReconnect: true, // 网络恢复刷新
  });
};
