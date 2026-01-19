import { useQuery } from "@tanstack/react-query";

import { getHistory } from "@/services";

export const useHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => getHistory(),
    staleTime: 0,
  });
};
