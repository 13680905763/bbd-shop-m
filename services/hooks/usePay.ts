import useSWR from "swr";

import axiosInstance from "../axiosInstance";

// 定义 fetcher，swr 推荐的异步数据获取函数
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export function usePay() {
  // 这里假设接口是 /user/info 返回当前用户信息
  const { data, error, isLoading, mutate } = useSWR(
    "/payment/list/group",
    fetcher,
    {
      revalidateOnFocus: false, // 是否在页面聚焦时重新请求
      shouldRetryOnError: false, // 请求失败是否自动重试
    },
  );

  return {
    payList: data,
    isLoading,
    isError: !!error,
    mutate, // 用于手动刷新数据
  };
}
