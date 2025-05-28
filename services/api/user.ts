import axiosInstance from "../axiosInstance";

export const getSimpleUserInfo = () => {
  return axiosInstance.get("/customer/simple");
};
export const getDetailUserInfo = () => {
  return axiosInstance.get("/customer/detail");
};

export const updateUserInfo = (data: any) => {
  return axiosInstance.put("/user/info", data);
};
