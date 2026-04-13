import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { promotionApi } from "@/services/promotionApi";
import { configApi, walletApi } from "@/services";

export const useInvitedUsers = (params: any) => {
  return useQuery({
    queryKey: ["invitedUsers", params],
    queryFn: () => promotionApi.listInvitedUsers(params),
    staleTime: 5 * 60 * 1000, // 5 分钟内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
    placeholderData: keepPreviousData,
  });
};
export const useExperience = (params: any) => {
  return useQuery({
    queryKey: ["experience"],
    queryFn: () => promotionApi.listExperienceDetails(params),
    staleTime: 5 * 60 * 1000, // 5 分钟内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
    placeholderData: keepPreviousData,
  });
};
export const useBonus = (params: any) => {
  return useQuery({
    queryKey: ["bonus"],
    queryFn: () => promotionApi.listBonusDetails(params),
    staleTime: 5 * 60 * 1000, // 5 分钟内认为是新鲜的
    refetchOnWindowFocus: true, // 用户回来自动更新
    refetchOnReconnect: true, // 网络恢复自动更新
    placeholderData: keepPreviousData,
  });
};

export function usePointsList() {
  return useInfiniteQuery({
    queryKey: ["pointsList"],
    queryFn: ({ pageParam = 1 }) =>
      walletApi.listPoints({ current: pageParam, size: 10 }),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
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