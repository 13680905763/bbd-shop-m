import { request } from "./request";
export const addressApi = {
  listAddress: (): Promise<any> =>
    request.get("/customer/address/list?addressType=1"),
  listBillingAddress: (): Promise<any> =>
    request.get("/customer/address/list?addressType=2"),
  addAddress: (data: any): Promise<string> =>
    request.post("/customer/address/add", { ...data, addressType: 1 }),
  addBillingAddress: (data: any): Promise<string> =>
    request.post("/customer/address/add", {
      ...data,
      addressType: 2,
      defaultAddress: 1,
    }),
  deleteAddress: (data: any): Promise<string> =>
    request.post("/customer/address/delete", data),
  updateAddress: (data: any): Promise<string> =>
    request.post("/customer/address/update", data),
};
