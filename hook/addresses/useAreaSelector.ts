import { useQuery } from "@tanstack/react-query";

import { getCities, getCountries, getProvinces } from "@/services";

// 获取国家列表
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    staleTime: 5 * 60 * 1000,
  });
};

// 获取省份列表
export const useProvinces = (countryId?: string) => {
  return useQuery({
    queryKey: ["provinces", countryId],
    queryFn: () => getProvinces(countryId as string),
    enabled: !!countryId, // 只有 countryId 存在才请求
    staleTime: 5 * 60 * 1000,
  });
};

// 获取城市列表
export const useCities = (stateId?: string) => {
  return useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => getCities(stateId as string),
    enabled: !!stateId,
    staleTime: 5 * 60 * 1000,
  });
};
