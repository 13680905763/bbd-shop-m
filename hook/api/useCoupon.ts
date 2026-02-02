import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/services/userApi";

export const useUserCoupon = (params: { status?: number | string }) => {
  return useQuery({
    queryKey: ["userCoupon", params],
    queryFn: () => userApi.listCoupon(params),
    staleTime: 10 * 1000, // 十秒保证数据足够新
    refetchOnWindowFocus: true,
  });
};
