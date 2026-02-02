import { useInfiniteQuery } from "@tanstack/react-query";

import { PromotionApi } from "@/services/promotionApi";

export const useInvitedUsers = () => {
  return useInfiniteQuery({
    queryKey: ["invitedUsers"],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        current: pageParam,
        size: 10,
      };

      return PromotionApi.listInvitedUsers(params);
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
export const useExperience = () => {
  return useInfiniteQuery({
    queryKey: ["experience"],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        current: pageParam,
        size: 10,
      };

      return PromotionApi.listExperience(params);
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
export const useBonus = () => {
  return useInfiniteQuery({
    queryKey: ["bonus"],
    queryFn: ({ pageParam = 1 }) => {
      const params = {
        current: pageParam,
        size: 10,
      };

      return PromotionApi.listBonus(params);
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * lastPage.size;

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};

// export const usePointsList = () => {
//   return useQuery({
//     queryKey: ["pointsList"],
//     queryFn: () => PromotionApi.listPromotionBonuses(),
//     staleTime: 10 * 1000, // 10 秒内认为是新鲜的
//     refetchOnWindowFocus: true, // 用户回来自动更新
//     refetchOnReconnect: true, // 网络恢复自动更新
//   });
// };
