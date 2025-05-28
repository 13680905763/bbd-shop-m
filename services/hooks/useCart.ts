// hooks/useCart.ts
import useSWR from "swr";

import axiosInstance from "../axiosInstance";
const fetchCart = async (url: string) => {
  const response = await axiosInstance.post(url, {}); // 根据你后端的接口改路径

  return response.data; // 假设后端返回的是 { code, msg, data }
};

export const useCart = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/customer/cart/list/shop/group",
    fetchCart,
  );

  console.log(666, data);

  return {
    cartData: data,
    isLoading,
    isError: error,
    mutate, // 用于刷新
  };
};
