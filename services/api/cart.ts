import axiosInstance from "../axiosInstance";

export const getCart = () => {
  return axiosInstance.post("/customer/cart/list/shop/group", {});
};
export const deleteCart = (data: any) => {
  return axiosInstance.post("/customer/cart/delete", data);
};
export const addCart = (data: any) => {
  return axiosInstance.post("/customer/cart/add", data);
};
