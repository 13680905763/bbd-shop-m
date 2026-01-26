import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/services/userApi";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: userApi.getUserInfo,
    staleTime: 10 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};
export const useUserExperience = () => {
  return useQuery({
    queryKey: ["userExperience"],
    queryFn: userApi.getExperience,
    staleTime: 10 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};
