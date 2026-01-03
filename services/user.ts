import { request, requestWithOption } from "./request";

import { LoginFormData, SignUpFormData, UserInfo } from "@/types";
/** 注册 */
export const signUpCustomer = (data: SignUpFormData): Promise<string> => {
  return requestWithOption<string>(
    {
      url: "/customer/sign-up",
      method: "POST",
      data,
    },
    { showToast: true }, // 成功/失败自动弹 toast
  );
};

/** 注册 / 邮箱验证 */
export const activateEmail = (data: any): Promise<string> => {
  return requestWithOption<string>(
    {
      url: "/customer/active",
      method: "POST",
      data,
    },
    { showToast: true }, // 成功/失败都会弹 toast
  );
};

/** 登录 */
export const loginCustomer = (data: LoginFormData): Promise<string> => {
  return requestWithOption<string>(
    {
      url: "/customer/login",
      method: "POST",
      data,
    },
    { showToast: true }, // 登录成功/失败都会弹 toast
  );
};

/** 谷歌登录 */
export const loginWithGoogle = (idToken: string): Promise<string> => {
  return requestWithOption<string>(
    {
      url: "/customer/google/login",
      method: "POST",
      data: { idToken },
    },
    { showToast: true }, // 登录成功/失败都会弹 toast
  );
};
export const loginWithGoogleNew = (authorizationCode: string): Promise<string> => {
  return requestWithOption<string>(
    {
      url: "/customer/google/code",
      method: "POST",
      data: { authorizationCode },
    },
    { showToast: true }, // 登录成功/失败都会弹 toast
  );
};

/** 退出登录 */
export const logoutCustomer = (): Promise<void> => {
  return requestWithOption<void>(
    {
      url: "/customer/logout",
      method: "GET",
    },
    { showToast: true }, // 成功提示“已退出登录”
  );
};

/** 获取用户信息 */
export const getUserInfo = (): Promise<UserInfo> => {
  return request("/customer/detail");
};
/** 更新用户信息 */
export const updateUserInfo = (data: any): Promise<UserInfo> => {
  return requestWithOption(
    { url: "/customer/update", method: "POST", data },
    { showToast: true },
  );
};
/** 获取用户信息 */
export const getMessageList = (params: string = ""): Promise<any> => {
  return request.get(`/system-notice/list`, { params });
};
/** 已读用户信息 */
export const readMessage = (id: string): Promise<any> => {
  return request.put("/system-notice/" + id);
};
/** 删除用户信息 */
export const delMessage = (ids: number[]): Promise<any> => {
  return request.delete("/system-notice/batch", {
    data: ids, // axios DELETE 需要包在 data 中
  });
};
/** 上传用户头像 */

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await request.post("/customer/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 明确告知服务器这是一个表单数据
      },
    });

    return response;
  } catch (error) {
    console.error("请求失败:", error);
    throw error + "上用户头像";
  }
};

/** 获取用户经验 */
export const getExperience = (): Promise<any> => {
  return request.get(`/customer-experience/myExperience`);
};
/** 获取积分列表 */
export const getPointsList = (current: number, size: number): Promise<any> => {
  return request.get(`/customer-points-detail?current=${current}&size=${size}`);
};
/** 获取经验列表 */
export const getExperienceList = (): Promise<any> => {
  return request.get(`/customer-experience-detail`);
};
/** 获取邀请列表 */
export const getPromotionUserList = (): Promise<any> => {
  return request.get(`/customer/inviteList`);
};
/** 获取奖金配置 */
export const getPromotionConfig = (): Promise<any> => {
  return request.get(`/promotion-config?configType=EXPERIENCE`);
};
/** 获取奖金配置 */
export const getPromotionBonusList = (): Promise<any> => {
  return request.get(`/customer-bonus-detail`);
};
export const updatePwd = (data: any): Promise<UserInfo> => {
  return requestWithOption(
    { url: "/customer/password", method: "POST", data },
    { showToast: true },
  );
};
