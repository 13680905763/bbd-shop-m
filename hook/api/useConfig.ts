import { useQuery } from "@tanstack/react-query";

import { configApi } from "@/services/configApi";
import { useGlobalStore } from "@/store";
import { useEffect } from "react";
import { setUserCurrency } from "@/i18n/service";

// 货物分类列表
export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: configApi.getCategories,
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
  });
};
// 货币列表
export const useCurrencyOptions = () => {
  const query = useQuery({
    queryKey: ["currencyOptions"],
    queryFn: configApi.getCurrencies,
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data } = query;
  const { setCurrencies, currency, setCurrency } = useGlobalStore();

  useEffect(() => {
    if (data && data.length > 0) {
      // 1. 同步币种列表
      setCurrencies(data);

      const formatted = data.map((item: any) => ({
        label: item.currency,
        value: item.currency,
        symbol: item.symbol,
        rate: item.rate,
      }));

      // 寻找当前选中的币种在接口列表中的实时数据
      const currentInNew = formatted.find((c: any) => c.value === currency?.value);

      /**
       * 判断是否需要更新当前选中的货币：
       * 1. 当前是本地兜底的 (isLocal)
       * 2. 汇率变了 (rate 不一致)
       * 3. 选中的币种在后台不存在了 (!currentInNew)
       */
      const needUpdate =
        currency?.isLocal ||
        (currentInNew && currentInNew.rate !== currency.rate) ||
        !currentInNew;

      if (needUpdate) {
        // 如果找不到匹配的（过期了），默认拿 fallback (USD 或第一个)
        const updateTarget =
          currentInNew ||
          formatted.find((c: any) => c.value === "USD") ||
          formatted[0];

        setCurrency(updateTarget);
        setUserCurrency(updateTarget)
      }
    }
  }, [data, currency, setCurrency, setCurrencies]);

  return query;
};

// 优惠券列表
export const useCouponsConfig = () => {
  return useQuery({
    queryKey: ["couponsConfig"],
    queryFn: () => configApi.getCoupons(),
    staleTime: 10 * 60 * 100 * 1000, // 10 秒内认为是新鲜的
  });
};
/** 运单附加服务*/
export function useWarehouseServicesList() {
  return useQuery({
    queryKey: ["warehouseServicesList"],
    queryFn: () => configApi.getWarehouseServices(),
    staleTime: 5 * 10 * 1000,
  });
}
/** 保险服务*/
export function useWarehouseServicesList1() {
  return useQuery({
    queryKey: ["warehouseServicesList1"],
    queryFn: () => configApi.getInsuranceServices(),
    staleTime: 5 * 10 * 1000,
  });
}
export function useOrderServicesList() {
  return useQuery({
    queryKey: ["orderServicesList"],
    queryFn: () => configApi.getOrderServices(),
    staleTime: 5 * 10 * 1000,
  });
}


