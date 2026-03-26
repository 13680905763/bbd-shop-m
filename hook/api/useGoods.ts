import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";
import { goodsApi, ToggleFavoriteParams } from "@/services";

export const useHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => goodsApi.getHistoryList(),
    staleTime: 0,
  });
};
export const useDelHistory = () => {
  return useMutation({
    mutationFn: (data: string[]) => goodsApi.deleteHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};
export const useFavorite = () => {
  return useQuery({
    queryKey: ["favorite"],
    queryFn: () => goodsApi.getFavoriteList(),
    staleTime: 0,
  });
};
export const useDelFavorite = () => {
  return useMutation({
    mutationFn: (data: string[]) => goodsApi.deleteFavorite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });
};
export const useFavoriteProduct = () => {
  return useMutation({
    mutationFn: (data: ToggleFavoriteParams) => goodsApi.toggleFavorite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });
};
export const getGoodsInfoById = (data: any) => {
  return goodsApi.getGoodsInfoById(data);
};

export const getGoodsId = (data: any) => {
  return goodsApi.smartSearch(data);
};

export const useUploadSearchImage = () => {
  return useMutation({
    mutationFn: (file: File) => goodsApi.uploadSearchImage(file),
  });
};
export const useSearchList = (params: any) => {
  return useInfiniteQuery({
    queryKey: ["searchList", params],
    queryFn: ({ pageParam = 1 }) => {

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { enabled, keyword, ...restParams } = params;

      if (keyword) {
        return goodsApi.searchByKeyword({
          ...restParams,
          keyword,
          current: pageParam,
        });
      }

      return goodsApi.searchByImage({
        ...restParams,
        current: pageParam,
      });
    },
    getNextPageParam: (lastPage: any) => {
      const loaded = lastPage.current * (params.size || 10);

      return loaded < lastPage.total ? lastPage.current + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    enabled: params.enabled !== false,
  });
};
