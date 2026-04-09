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
  /** 注册 */
  register: async (data: RegisterParams): Promise<string> => {
    const encryptedData = await encryptField(data);

    return request.post("/customer/sign-up", encryptedData);
  },
  /** 激活邮箱 */
  activateEmail: async (data: ActivateEmailParams): Promise<string> => {
    const encryptedData = await encryptField(data);
    return request.post("/customer/active", encryptedData);
  },
  /** 登录 */
  login: async (data: LoginParams): Promise<string> => {
    const encryptedData = await encryptField(data);

    return request.post("/customer/login", encryptedData);
  },
  /** 谷歌登录 */
  googleLogin: async (data: GoogleLoginParams): Promise<string> => {
    const encryptedData = await encryptField(data);

    return request.post("/customer/google/code", encryptedData);
  },
  /** 退出登录 */
  logout: (): Promise<void> => request.get("/customer/logout"),
  /** 忘记密码 */
  forgotPassword: (data: { email: string }): Promise<string> =>
    request.post("/customer/forget-password", data),
};
