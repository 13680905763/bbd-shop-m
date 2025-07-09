import { useQuery } from "@tanstack/react-query";

import { getAddressList } from "@/services";

export const useBillingAddressList = () => {
  return useQuery({
    queryKey: ["billingAddressList"],
    queryFn: () => getAddressList(2),
    staleTime: 5 * 60 * 1000, // 缓存 5 分钟
  });
};
