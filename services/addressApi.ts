import { request } from "./request";

export const addressApi = {
  listAddress: (): Promise<any> => {
    return request.get("/customer/address/list?addressType=1");
  },
  addAddress: (data: any): Promise<string> => {
    return request.post("/customer/address/add", data);
  },
  deleteAddress: (data: any): Promise<string> => {
    return request.post(`/customer/address/delete`, data);
  },
  updateAddress: (data: any): Promise<string> => {
    return request.post("/customer/address/update", data);
  },
};
