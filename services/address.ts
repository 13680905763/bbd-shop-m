// services/address.ts

import { request } from "@/utils/request";

export const addAddress = (data: any) => {
  return request.post("/customer/address/add", data);
};

export const updateAddress = (data: any) => {
  return request.post("/customer/address/update", data);
};

export const deleteAddress = (id: string) => {
  return request.post(`/customer/address/delete`, { id });
};
