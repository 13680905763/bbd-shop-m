import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { addressApi } from "@/services/addressApi";
import { queryClient } from "@/lib/react-query";

export function useAddressList() {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: () => addressApi.listAddress(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export const useBillingAddress = () => {
  return useQuery({
    queryKey: ["billingAddress"],
    queryFn: async () => {
      const res = await addressApi.listBillingAddress();
      return res[0] || {};
    },
    staleTime: 0,
  });
};
export const useAddAddress = () => {
  return useMutation({
    mutationKey: ["addAddress"],
    mutationFn: (data: any) => addressApi.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });
};
export const useAddBillingAddress = () => {
  return useMutation({
    mutationKey: ["addBillingAddress"],
    mutationFn: (data: any) => addressApi.addBillingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });
};
export const useUpdateAddress = () => {
  return useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: (data: any) => addressApi.updateAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });
};
export const useDeleteAddress = () => {
  return useMutation({
    mutationKey: ["deleteAddress"],
    mutationFn: (data: any) => addressApi.deleteAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] });
    },
  });
};