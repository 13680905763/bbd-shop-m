import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

import {
  cartApi,
  DeleteCartParams,
  CheckoutParams,
  UpdateCartParams,
} from "@/services/cartApi";
import { queryClient } from "@/lib/react-query";
// 获取购物车列表
export function useCartList() {
  const query = useQuery({
    queryKey: ["cartList"],
    queryFn: () => cartApi.getCart(),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    flatList:
      query?.data
        ?.flatMap((shop: any) => shop.cartList)
        ?.filter((item: any) => item.status !== 3) || [],
  };
}
// 添加商品到购物车
export function useAddCartItem() {
  return useMutation({
    mutationFn: (data: any) => cartApi.addItem(data),
    onSuccess: (res) => {
      console.log("success");
      addToast({
        title: res,
        timeout: 1000,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
    onError: (error) => {
      console.log("error", error);
      if (!error) {
        addToast({
          title: "please login first",
          color: "danger",
        });
      }
    },
  });
}
// 更新购物车商品（数量/备注）
export function useUpdateCartItem() {
  const mutation = useMutation({
    mutationFn: (data: UpdateCartParams) => cartApi.updateItem([data]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
    onError: (error) => {
      addToast({
        title: error.message || "Update Cart Item Error",
        color: "danger",
      });
    },
  });

  return {
    updateItem: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
// 删除购物车商品
export function useDeleteCart() {
  const mutation = useMutation({
    mutationFn: (data: DeleteCartParams) => cartApi.deleteItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
  });

  return {
    deleteItem: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
export function useSubmitCart() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (data: CheckoutParams) => cartApi.checkout(data),
    onSuccess: (key) => {
      router.push(`/submit/order?type=cart&key=${key}`);
    },
  });

  return {
    submitCart: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
}
