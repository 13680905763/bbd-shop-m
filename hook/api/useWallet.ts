import { useQuery, useInfiniteQuery, useMutation, } from "@tanstack/react-query";
import { walletApi } from "@/services/walletApi";
import { queryClient } from "@/lib/react-query";

// 钱包信息
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
// 钱包交易记录
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
// 用户优惠券列表
export const useUserCoupon = (params: { status?: number | string }) => {
  return useQuery({
    queryKey: ["userCoupon", params],
    queryFn: () => walletApi.listCoupon(params),
    staleTime: 10 * 1000, // 十秒保证数据足够新
    refetchOnWindowFocus: true,
  });
};
// 支付方式列表
export function usePaymentMethodList(params: {
  bizCode: string;
  customerCouponId?: string;
}) {
  return useQuery({
    queryKey: ["paymentMethodList", params],
    queryFn: () => walletApi.listPaymentMethod(params),
    gcTime: 1000 * 60,
    staleTime: 0,
    refetchOnMount: true,
    placeholderData: (previousData) => previousData, // 保持旧数据直到新数据加载完成
  });
}
// 支付
export function usePay() {
  return useMutation({
    mutationFn: (data: {
      bizCode: string;
      paymentId: string | number;
      addressId: number | string;
      customerCouponId?: string;
    }) => walletApi.pay(data),
  });
}
// 兑换优惠券
export const usePointExchangeCoupon = () => {
  return useMutation({
    mutationFn: (couponId: string | number) =>
      walletApi.pointExchangeCoupon(couponId),
    onSuccess: () => {
      // 刷新用户优惠券列表
      queryClient.invalidateQueries({ queryKey: ["userCoupon"] });
      // 刷新钱包信息（积分变动）
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["pointsList"] });

    },

  });
};
// 兑换码兑换优惠券
export const useCodeExchangeCoupon = () => {
  return useMutation({
    mutationFn: (redemptionCode: string) =>
      walletApi.codeExchangeCoupon(redemptionCode),
    onSuccess: () => {
      // 刷新用户优惠券列表
      queryClient.invalidateQueries({ queryKey: ["userCoupon"] });
      // 刷新钱包信息（积分变动）
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
    },
  });
};
