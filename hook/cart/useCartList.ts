import { useQuery } from "@tanstack/react-query";

import { getCartList } from "@/services";

export const useCartList = () => {
  return useQuery({
    queryKey: ["cartList"],
    queryFn: () => getCartList(),
    // staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
