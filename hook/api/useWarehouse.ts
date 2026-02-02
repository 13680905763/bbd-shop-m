import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { warehouseApi } from "@/services/warehouseApi";
import { WarehousePackageListParams } from "@/types/warehouse";
import { queryClient } from "@/lib/react-query";

export function useWarehousePackageList(params: WarehousePackageListParams) {
  return useInfiniteQuery({
    queryKey: ["warehousePackageList", params],
    queryFn: ({ pageParam = 1 }) => {
      return warehouseApi.listPackages({
        ...params,
        current: pageParam,
      });
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false, //  禁止切回 Tab 时自动请求
  });
}

/** 创建结算预览 key */
export function useCreateWaybillPreview() {
  return useMutation({
    mutationFn: (packageIds: string[]) =>
      warehouseApi.createWaybillPreview({ packageSet: packageIds }),
  });
}
export function useWaybillFeeEstimate(data: any) {
  return useQuery<any>({
    queryKey: ["waybillFeeEstimate", data],
    queryFn: () => {
      if (!data) {
        return {};
      }

      return warehouseApi.getWaybillFeeEstimate(data);
    },
  });
}

/** 获取运单预览详情 */
export function useWaybillPreview(key: string) {
  return useQuery({
    queryKey: ["waybillPreview", key],
    queryFn: () => warehouseApi.getWaybillPreview(key),
    // ✅ 30 分钟内视为新鲜数据
    staleTime: 30 * 60 * 1000,
    // ✅ 30 分钟后自动被 GC
    gcTime: 30 * 60 * 1000,
    // ✅ key 变化才重新请求
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
export function useLineByWaybill(data: any) {
  return useQuery<any>({
    queryKey: ["lineByWaybill", data],
    queryFn: () => {
      if (!data) {
        return {};
      }

      return warehouseApi.listLineByWaybill(data);
    },
  });
}
/** 创建运单 */
export function useCreateWaybill() {
  return useMutation({
    mutationFn: (data: any) => warehouseApi.createWaybill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehousePackageList"] });
    },
  });
}
