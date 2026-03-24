import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

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
      walletApi.listWalletDetail({ current: pageParam, size: 10 }),
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
  const payMutation = useMutation({
    mutationFn: (data: {
      bizCode: string;
      paymentId: string | number;
      addressId: number | string;
      customerCouponId?: string;
    }) => walletApi.pay(data),
    onSuccess: (res) => {
      if (typeof res === "string" && res.startsWith("http")) {
        window.location.href = res;
      }
    },
    onError: (error) => {
      addToast({
        title: error?.message || "Payment failed, please try again",
        color: "danger",
      });
    },
  });

  return {
    pay: payMutation.mutate,
    isPayFetching: payMutation.isPending,
  };
}
// 积分兑换优惠券
export const usePointExchangeCoupon = () => {
  const pointExchangeCouponMutation = useMutation({
    mutationFn: (couponId: string | number) =>
      walletApi.pointExchangeCoupon(couponId),
    onSuccess: (res) => {
      addToast({
        title: res || "Coupon redemption successful",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["userCoupon"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["pointsList"] });
    },
  });

  return {
    pointExchangeCoupon: pointExchangeCouponMutation.mutateAsync,
    isChanging: pointExchangeCouponMutation.isPending,
  };
};
// 兑换码兑换优惠券
export const useCodeExchangeCoupon = () => {
  const codeExchangeCouponMutation = useMutation({
    mutationFn: (redemptionCode: string) =>
      walletApi.codeExchangeCoupon(redemptionCode),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["userCoupon"] });
      addToast({
        title: res || "Coupon redemption successful",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: error?.message || "Coupon redemption failed, please try again",
        color: "danger",
      });
    },
  });

  return {
    codeExchangeCoupon: codeExchangeCouponMutation.mutate,
    isChanging: codeExchangeCouponMutation.isPending,
  };
};

// 申请提现
export const useApplyWithdrawal = () => {
  const mutation = useMutation({
    mutationFn: (data: { currencyAmount: number; currencyCode: string }) =>
      walletApi.applyWithdrawal(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
      addToast({
        title: res || "Withdrawal application submitted successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title:
          error?.message || "Withdrawal application failed, please try again",
        color: "danger",
      });
    },
  });

  return {
    applyWithdrawal: mutation.mutate,
    isApplying: mutation.isPending,
  };
};

// 提现流水
export function useWithdrawalList() {
  return useInfiniteQuery({
    queryKey: ["withdrawalList"],
    queryFn: ({ pageParam = 1 }) =>
      walletApi.listWithdrawalHistory({ current: pageParam, size: 10 }),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
