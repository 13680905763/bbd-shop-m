import { queryClient } from "@/lib/react-query";
import { goodsApi } from "@/services";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useHistory = () => {
    return useQuery({
        queryKey: ["history"],
        queryFn: () => goodsApi.listHistory(),
        staleTime: 0,
    });
};
export const useDelHistory = () => {
    return useMutation({
        mutationFn: (data: string[]) => goodsApi.delHistory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
    });
};
export const useFavorite = () => {
    return useQuery({
        queryKey: ["favorite"],
        queryFn: () => goodsApi.listFavorite(),
        staleTime: 0,
    });
};
export const useDelFavorite = () => {
    return useMutation({
        mutationFn: (data: string[]) => goodsApi.delFavorite(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorite"] });
        },
    });
};
export const useFavoriteProduct = () => {
    return useMutation({
        mutationFn: (data: {
            source: string;
            sourceProductId: string;
            collection: number;
        }) => goodsApi.favoriteProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorite"] });
        },
    });
};
export const useSearchList = (params: any) => {
    return useInfiniteQuery({
        queryKey: ["searchList", params],
        queryFn: ({ pageParam = 1 }) => {
            const { enabled, ...restParams } = params;
            return goodsApi.listSearch({
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