// services/address.ts

import { request } from "./request";

export const addAddress = (data: any): Promise<string> => {
  return request.post("/customer/address/add", data);
};

export const updateAddress = (data: any): Promise<string> => {
  return request.post("/customer/address/update", data);
};

export const deleteAddress = (data: any): Promise<string> => {
  return request.post(`/customer/address/delete`, data);
};
export const getAddressList = (addressType: number): Promise<any> => {
  return request.get("/customer/address/list?addressType=" + addressType);
};
