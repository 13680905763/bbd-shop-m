import { request } from "./request";

/** 登录请求参数 */
export interface LoginParams {
  email: string;
  password: string;
}

/** 注册请求参数 */
export interface RegisterParams extends LoginParams {
  inviteCode?: string;
  agreeToTerms?: boolean;
}

/** 邮箱激活参数 */
export interface ActivateEmailParams {
  // 根据实际字段定义
  code?: string;
  email?: string;
}

/** 谷歌登录参数 */
export interface GoogleLoginParams {
  // 根据实际字段定义
  code?: string;
  authorizationCode?: string;
  inviteCode?: string;
  // 或其他字段
}

export const authApi = {
  /** 注册 */
  register: (data: RegisterParams): Promise<string> =>
    request.post("/customer/sign-up", data),
  /** 激活邮箱 */
  activateEmail: (data: ActivateEmailParams): Promise<string> =>
    request.post("/customer/active", data),
  /** 登录 */
  login: (data: LoginParams): Promise<string> =>
    request.post("/customer/login", data),
  /** 谷歌登录 */
  googleLogin: (data: GoogleLoginParams): Promise<string> =>
    request.post("/customer/google/code", data),
  /** 退出登录 */
  logout: (): Promise<void> => request.get("/customer/logout"),
  /** 忘记密码 */
  forgotPassword: (data: { email: string }): Promise<string> =>
    request.post("/customer/forget-password", data),
};
