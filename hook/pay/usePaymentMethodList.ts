import { useQuery } from "@tanstack/react-query";

import { getPaymentMethodList } from "@/services";

export function usePaymentMethodList(bizCode: string) {
  return useQuery({
    queryKey: ["paymentMethodList", bizCode],
    queryFn: () => getPaymentMethodList(bizCode),
    gcTime: 1000 * 60,
    staleTime: 0,
    refetchOnMount: true,
  });
}
