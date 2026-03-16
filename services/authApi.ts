import { request } from "./request";
/** 登录请求参数 */
export interface LoginRequest {
  email: string;
  password: string;
}
/** 注册请求参数 */
export interface SignUpRequest extends LoginRequest {
  inviteCode?: string;
  agreeToTerms?: boolean;
}
export const authApi = {
  /** 注册 */
  signUp: (data: SignUpRequest): Promise<string> => request.post("/customer/sign-up", data),
  /** 注册邮箱验证 */
  activateEmail: (data: any): Promise<string> => request.post("/customer/active", data,),
  /** 登录 */
  login: (data: LoginRequest): Promise<string> => request.post("/customer/login", data),
  /** 谷歌登录 */
  loginWithGoogle: (data: any): Promise<string> => request.post("/customer/google/code", data),
  /** 退出登录 */
  logout: (): Promise<void> => request.get("/customer/logout"),
  /** 忘记密码 */
  forgetPassword: (data: { email: string }): Promise<string> =>
    request.post("/customer/forget-password", data),
};
