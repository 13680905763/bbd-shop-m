import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { walletApi } from "@/services/walletApi";

export const useWalletInfo = () => {
  return useQuery({
    queryKey: ["walletInfo"],
    queryFn: walletApi.getWalletInfo,
    staleTime: 0, // 每次都视为过期，触发重新请求
    refetchOnMount: true, // 进入页面检查更新
    refetchOnWindowFocus: true, // 切回标签页刷新
    refetchOnReconnect: true, // 网络恢复刷新
  });
};

export function useWalletDetailList() {
  return useInfiniteQuery({
    queryKey: ["walletDetailList"],
    queryFn: ({ pageParam = 1 }) =>
      walletApi.getWalletDetailList(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
export const useUserCoupon = (params: { status?: number | string }) => {
  return useQuery({
    queryKey: ["userCoupon", params],
    queryFn: () => walletApi.listCoupon(params),
    staleTime: 10 * 1000, // 十秒保证数据足够新
    refetchOnWindowFocus: true,
  });
};
export function usePaymentMethodList(bizCode: string) {
  return useQuery({
    queryKey: ["paymentMethodList", bizCode],
    queryFn: () => walletApi.listPaymentMethod(bizCode),
    gcTime: 1000 * 60,
    staleTime: 0,
    refetchOnMount: true,
  });
}