import { request } from "./request";

export const getGoodsInfo = (data: any) => {
  return request.post("/product/search/id", data);
};
