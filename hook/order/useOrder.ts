import { useQuery } from "../api/useQuery";

export const usePayMethod = (bizCode: string) =>
  useQuery(`/customer/pay-order/preview?bizCode=${bizCode}`);
export const usePayOrderStatus = (data: string) =>
  useQuery(`/customer/pay-order/status?bizCode=${data}`, false);
export const useOrderList = (page: number, size: number) =>
  useQuery(`/orders/page?current=${page}&size=${size}`);
