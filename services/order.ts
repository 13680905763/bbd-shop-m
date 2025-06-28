import { request } from "@/utils/request";

export const createOrderByRecharge = (data: any) =>
  request.post("/customer/wallet/recharge", data);

export const createOrderByProduct = (data: any) =>
  request.post("/orders/create", data);

export const createOrderByCart = (data: any) =>
  request.post("/customer/cart/submit", data);

export const createPayOrder = (data: any) =>
  request.post("/customer/pay-order/create", data);

export const getOrderList = (data: { current: number; size: number }) =>
  request.post(`/orders/page`, data);
export const getPayOrderStatus = (bizCode: string) =>
  request.get(`/customer/pay-order/status?bizCode=${bizCode}`);
