import { useQuery } from "@tanstack/react-query";

import { configApi } from "@/services/configApi";

export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: configApi.getCategory,
    staleTime: 50 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};
export const useBonusConfig = () => {
  return useQuery({
    queryKey: ["bonusConfig"],
    queryFn: () => configApi.getBonusConfig(),
    staleTime: 10 * 60 * 100 * 1000, // 10 分钟内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
  });
};
export const useCouponsConfig = () => {
  return useQuery({
    queryKey: ["couponsConfig"],
    queryFn: () => configApi.listCoupons(),
    staleTime: 10 * 60 * 100 * 1000, // 10 秒内认为是新鲜的
  });
};
/** 运单附加服务*/
export function useWarehouseServicesList() {
  return useQuery({
    queryKey: ["warehouseServicesList"],
    queryFn: () => configApi.listWarehouseServices(),
    staleTime: 5 * 10 * 1000,
  });
}

// 获取国家列表
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => configApi.listCountries(),
    staleTime: 5 * 60 * 1000,
  });
};

// 获取省份列表
export const useProvinces = (countryId?: string) => {
  return useQuery({
    queryKey: ["provinces", countryId],
    queryFn: () => configApi.listProvinces(countryId as string),
    enabled: !!countryId, // 只有 countryId 存在才请求
    staleTime: 5 * 60 * 1000,
  });
};

// 获取城市列表
export const useCities = (stateId?: string) => {
  return useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => configApi.listCities(stateId as string),
    enabled: !!stateId,
    staleTime: 5 * 60 * 1000,
  });
};
