import { request } from "./request";

import { LoginFormData, SignUpFormData, UserInfo } from "@/types";

/** 注册 */
export const signUpCustomer = (data: SignUpFormData) => {
  return request.post("/customer/sign-up", data);
};

/** 注册 邮箱验证 */
export const activateEmail = (data: any): Promise<string> => {
  return request.post("/customer/active", {
    ...data,
  });
};

/** 登录 */
export const loginCustomer = (data: LoginFormData): Promise<string> => {
  return request.post("/customer/login", data);
};

/** 谷歌登录 */
export const loginWithGoogle = (idToken: string): Promise<string> => {
  return request.post("/customer/google/login", {
    idToken,
  });
};

/** 退出登录 */
export const logoutCustomer = () => {
  return request.get("/customer/logout");
};

/** 获取用户信息 */
export const getUserInfo = (): Promise<UserInfo> => {
  return request.get("/customer/detail");
};
