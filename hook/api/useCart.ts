// hooks/useCart.js
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { cartApi } from "@/services/cartApi";

// 获取购物车列表
export function useCartList() {
  return useQuery({
    queryKey: ["cartList"],
    queryFn: () => cartApi.getList(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

// 添加商品到购物车
export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
}

// 更新购物车商品（数量/备注）
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => cartApi.updateItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
}

// 删除购物车商品
export function useDeleteCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => cartApi.deleteItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });
}

export function useCreateOrderPreview() {
  return useMutation({
    mutationFn: (data: any) => cartApi.createOrderPreview(data),
  });
}
