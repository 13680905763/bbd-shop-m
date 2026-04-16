import { request } from "./request";
import { encryptField } from "@/lib/encrypt";

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
  /** 注册新用户 */
  register: async (data: RegisterParams): Promise<string> =>
    request.post("/customer/sign-up", await encryptField(data)),

  /** 用户登录 */
  login: async (data: LoginParams): Promise<string> =>
    request.post("/customer/login", await encryptField(data)),

  /** 谷歌账号一键登录 */
  loginByGoogle: async (data: GoogleLoginParams): Promise<string> =>
    request.post("/customer/google/code", await encryptField(data)),

  /** 激活或验证邮箱 */
  verifyEmail: async (data: ActivateEmailParams): Promise<string> =>
    request.post("/customer/active", await encryptField(data)),

  /** 退出当前登录状态 */
  logout: (): Promise<void> => request.get("/customer/logout"),
};
