import { useQuery } from "@tanstack/react-query";

import { getOrderPreviewCart, getOrderPreviewProduct } from "@/services";
import { OrderPreviewByCart, OrderPreviewByProduct } from "@/types";

export function useOrderPreview(type: "cart" | "product", key: string) {
  return useQuery<OrderPreviewByCart | OrderPreviewByProduct>({
    queryKey: ["orderPreview", type, key],
    queryFn: () => {
      return type === "cart"
        ? getOrderPreviewCart(key)
        : getOrderPreviewProduct(key);
    },
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    // ❌ 切换标签页不再重新请求
    refetchOnWindowFocus: false,
  });
}
