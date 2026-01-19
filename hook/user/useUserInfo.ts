import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@/services";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserInfo,
    staleTime: 0, // 每次都视为过期，触发重新请求
    refetchOnMount: true, // 组件挂载时强制请求
    refetchOnWindowFocus: true, // 切回标签页刷新
    refetchOnReconnect: true, // 网络恢复刷新
  });
};
