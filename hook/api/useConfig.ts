import { useQuery } from "@tanstack/react-query";

import { configApi } from "@/services/configApi";

// 货物分类列表
export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: configApi.getCategories,
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
  });
};
// 货币列表
export const useCurrencyOptions = () => {
  return useQuery({
    queryKey: ["currencyOptions"],
    queryFn: configApi.getCurrencies,
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
  });
};
// 奖金等级列表
export const useBonusConfig = () => {
  return useQuery({
    queryKey: ["bonusConfig"],
    queryFn: () => configApi.getBonusConfig(),
    staleTime: 10 * 60 * 100 * 1000, // 10 分钟内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
// 优惠券列表
export const useCouponsConfig = () => {
  return useQuery({
    queryKey: ["couponsConfig"],
    queryFn: () => configApi.getCoupons(),
    staleTime: 10 * 60 * 100 * 1000, // 10 秒内认为是新鲜的
  });
};
/** 运单附加服务*/
export function useWarehouseServicesList() {
  return useQuery({
    queryKey: ["warehouseServicesList"],
    queryFn: () => configApi.getWarehouseServices(),
    staleTime: 5 * 10 * 1000,
  });
}
/** 保险服务*/
export function useWarehouseServicesList1() {
  return useQuery({
    queryKey: ["warehouseServicesList1"],
    queryFn: () => configApi.getInsuranceServices(),
    staleTime: 5 * 10 * 1000,
  });
}
export function useOrderServicesList() {
  return useQuery({
    queryKey: ["orderServicesList"],
    queryFn: () => configApi.getOrderServices(),
    staleTime: 5 * 10 * 1000,
  });
}


