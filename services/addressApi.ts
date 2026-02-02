import { request } from "./request";

export const addressApi = {
  listAddress: (): Promise<any> => {
    return request.get("/customer/address/list?addressType=1");
  },
};
