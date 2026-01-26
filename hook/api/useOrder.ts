import {
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { OrderApi } from "@/services/orderApi";
import { queryClient } from "@/lib/react-query";

export function useOrderList(params: any) {
  return useQuery({
    queryKey: ["orderList", params],
    queryFn: () => OrderApi.listOrder(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
  });
}
export function useRefundOrderList(params: any) {
  return useQuery({
    queryKey: ["refundOrderList", params],
    queryFn: () => OrderApi.listRefundOrder(params),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
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
  })
}
export function useRefundOrder() {
  return useMutation({
    mutationFn: (data: any) => OrderApi.refundOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  })
}
export function useRevokeOrder() {
  return useMutation({
    mutationFn: (id: string) => OrderApi.revokeOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderList"] });
    },
  });
}
