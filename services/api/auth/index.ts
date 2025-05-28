import axiosInstance from "../../axiosInstance";

export const getlogin = (data: { email: string; password: string }) => {
  return axiosInstance.post("/customer/login", {
    ...data,
  });
};

export const getlogout = () => {
  return axiosInstance.get("/customer/logout");
};
export const getsignUp = (data: { email: string; password: string }) => {
  return axiosInstance.post("/customer/sign-up", {
    ...data,
  });
};
export const getcallback = (data: any) => {
  return axiosInstance.post("/customer/callback", {
    ...data,
  });
};
