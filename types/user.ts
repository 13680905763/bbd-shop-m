/** 登录表单请求参数 */
export interface LoginFormData {
  email: string;
  password: string;
}
/** 注册表单请求参数 */
export interface SignUpFormData extends LoginFormData {
  inviteCode?: string;
  agreeToTerms?: boolean;
}

export interface UserInfo {
  id: string;
  createTime: string; // 格式 "YYYY-MM-DD HH:mm:ss"
  updateTime: string;
  name: string;
  givenName: string;
  familyName: string;
  nickName: string;
  email: string;
  mobile: string;
  sex: number; // 1 代表男性，其他可根据后台定义
  birthday: string; // 格式 "YYYY-MM-DD"
  selfIntroduction: string;
  avatarFilePath: string;
  avatarUrl: string;
  signUpType: number; // 注册类型，具体含义看后台文档
  urlExpirationAt: string; // 过期时间，格式 "YYYY-MM-DD HH:mm:ss"
  status: number; // 用户状态，具体含义看后台文档
}
export interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  clearUser: () => void;
}
