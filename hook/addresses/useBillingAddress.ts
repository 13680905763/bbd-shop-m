import { useQuery } from "@tanstack/react-query";

import { getAddressList } from "@/services";

export const useBillingAddress = () => {
  return useQuery({
    queryKey: ["billingAddress"],
    queryFn: async () => {
      const res = await getAddressList(2);

      return res[0] || {};
    },
    staleTime: 0,
  });
};
