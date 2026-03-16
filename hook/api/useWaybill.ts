import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { waybillApi } from "@/services/waybillApi";
import { queryClient } from "@/lib/react-query";

export function useWaybillList(params: any) {
  return useInfiniteQuery({
    queryKey: ["waybillList", params],
    queryFn: ({ pageParam = 1 }) => {
      return waybillApi.listWaybill({
        ...params,
        current: pageParam,
      });
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false, // ⚠️ 禁止切回 Tab 时自动请求
  });
}
export function useBatchPay() {
  return useMutation({
    mutationFn: (params: { packageSet: string[] }) =>
      waybillApi.batchPay(params),
  });
}
export function usePreviewCancel() {
  return useMutation({
    mutationFn: (waybillId: string) => waybillApi.previewCancel(waybillId),
  });
}
export function useCancelWaybill() {
  return useMutation({
    mutationFn: (waybillId: string) => waybillApi.cancelWaybill(waybillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
      queryClient.invalidateQueries({ queryKey: ["warehouseList"] });
    },
  });
}
export function useWithdrawCancel() {
  return useMutation({
    mutationFn: (waybillId: string) => waybillApi.withdrawCancel(waybillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
export function usePreviewChangeLine() {
  return useMutation({
    mutationFn: (waybillId: string) => waybillApi.previewChangeLine(waybillId),
  });
}
export function usePreviewChangeLine1(data: any) {
  return useQuery<any>({
    queryKey: ["lineByWaybill", data],
    queryFn: () => waybillApi.previewChangeLine1(data),
    enabled: !!data,
    retry: 0, // 不重试
  });
}
export function useChangeLine() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.changeLine(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
export function useTrackDetail() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.trackDetail(params),
  });
}
export function useReceipt() {
  return useMutation({
    mutationFn: (outboundPackingId: string) =>
      waybillApi.receipt(outboundPackingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
export function useChangeAddress() {
  return useMutation({
    mutationFn: (params: any) => waybillApi.changeAddress(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waybillList"] });
    },
  });
}
