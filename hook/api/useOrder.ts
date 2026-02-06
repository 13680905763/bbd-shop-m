import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { OrderApi } from "@/services/orderApi";
import { queryClient } from "@/lib/react-query";

export function useOrderList(params: any) {
  return useInfiniteQuery({
    queryKey: ["orderList", params],
    queryFn: ({ pageParam = 1 }) => {
      const { enabled, ...restParams } = params;

      return OrderApi.listOrder({
        ...restParams,
        current: pageParam,
      });
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * (params.size || 10);

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    enabled: params.enabled !== false,
  });
}
export function useRefundOrderList(params: any) {
  return useInfiniteQuery({
    queryKey: ["refundOrderList", params],
    queryFn: ({ pageParam = 1 }) => {
      const { enabled, ...restParams } = params;

      return OrderApi.listRefundOrder({
        ...restParams,
        current: pageParam,
      });
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
    enabled: params.enabled !== false,
  });
}
export function useCancelOrder() {
  return useMutation({
    mutationFn: (orderId: string) => OrderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });
}
export function useBatchPayOrder() {
  return useMutation({
    mutationFn: (data: any) => OrderApi.batchPayOrder(data),
  });
}
export function useRefundOrder() {
  return useMutation({
    mutationFn: (data: any) => OrderApi.refundOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });
}
export function useRevokeOrder() {
  return useMutation({
    mutationFn: (id: string) => OrderApi.revokeOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });
}

export function useForwardingOrder() {
  return useMutation({
    mutationFn: (data: any): any => OrderApi.forwardingOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });
}
export function usePreviewOrderByCart(key: string) {
  return useQuery<any>({
    queryKey: ["orderPreviewByCart", key],
    queryFn: () => OrderApi.previewOrderByCart(key),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: key !== "",
  });
}
export function usePreviewOrderByProduct(key: string) {
  return useQuery<any>({
    queryKey: ["orderPreviewByProduct", key],
    queryFn: () => OrderApi.previewOrderByProduct(key),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: key !== "",
  });
}