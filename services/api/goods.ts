import axiosInstance from "../axiosInstance";

export const getGoodsInfo = (data: any) => {
  return axiosInstance.post("/product/search/id", data);
};
