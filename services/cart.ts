import { request } from "@/utils/request";

export const deleteCart = (data: any) => {
  return request.post("/customer/cart/delete", data);
};
export const addCart = (data: any) => {
  return request.post("/customer/cart/add", data);
};
export const updateCart = (data: any) => {
  return request.post("/customer/cart/update", data);
};
