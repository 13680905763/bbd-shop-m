import { useQuery } from "../api/useQuery";

export const useWalletInfo = () => useQuery("/customer/wallet/info");
export const useWalletDetail = (page: number, size: number) =>
  useQuery(`/customer/wallet/detail/page?current=${page}&size=${size}`);
