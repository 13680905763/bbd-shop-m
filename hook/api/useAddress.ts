import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { addressApi } from "@/services/addressApi";
import { queryClient } from "@/lib/react-query";

export function useAddressList() {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: () => addressApi.list(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export const useBillingAddress = () => {
  return useQuery({
    queryKey: ["billingAddress"],
    queryFn: async () => {
      const res: any = await addressApi.listInvoice();

      return res[0] || {};
    },
    staleTime: 0,
  });
};
export const useAddAddress = () => {
  return useMutation({
    mutationKey: ["addAddress"],
    mutationFn: (data: any) => addressApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });
};
export const useAddBillingAddress = () => {
  return useMutation({
    mutationKey: ["addBillingAddress"],
    mutationFn: (data: any) => addressApi.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });
};
export const useUpdateAddress = () => {
  return useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: (data: any) => addressApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });
};
export const useDeleteAddress = () => {
  return useMutation({
    mutationKey: ["deleteAddress"],
    mutationFn: (data: { id: string | number }) => addressApi.remove(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });
};

// --- 系统基础数据 ---

/** 获取国家列表 */
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => addressApi.listCountries(),
    staleTime: 5 * 60 * 1000,
  });
};

/** 获取省份列表 */
export const useProvinces = (countryId?: string) => {
  return useQuery({
    queryKey: ["provinces", countryId],
    queryFn: () => addressApi.listProvinces(countryId as string),
    enabled: !!countryId,
    staleTime: 5 * 60 * 1000,
  });
};

/** 获取城市列表 */
export const useCities = (stateId?: string) => {
  return useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => addressApi.listCities(stateId as string),
    enabled: !!stateId,
    staleTime: 5 * 60 * 1000,
  });
};
