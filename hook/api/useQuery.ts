import useSWR from "swr";

import { fetcher } from "@/utils/request";

export function useQuery<T = any>(key: string | null, enabled = true) {
  const swr = useSWR<T>(enabled ? key : null, fetcher);

  return {
    ...swr,
    isError: !!swr.error,
  };
}
