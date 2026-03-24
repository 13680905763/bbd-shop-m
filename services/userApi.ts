import { request } from "./request";

export const userApi = {
  /** 获取用户信息 */
  getUserInfo: (): Promise<any> => request.get("/customer/detail"),
  /** 更新用户信息 */
  updateUserInfo: (data: any): Promise<any> =>
    request.post(`/customer/update`, data),
  /** 变更密码 */
  changePassword: (data: any): Promise<any> =>
    request.post(`/customer/password`, data),
  /** 获取用户经验 */
  getExperience: (): Promise<any> =>
    request.get(`/customer-experience/myExperience`),
  /** 获取经验明细 */
  listExperience: (params: any): Promise<any> =>
    request.get(`/customer-experience-detail`, { params }),
  /** 上传用户头像 */
  uploadAvatar: (file: File): Promise<any> => {
    const formData = new FormData();

    formData.append("file", file);

    return request.post("/customer/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  /** 发送验证码 */
  sendVerificationCode: (email: string): Promise<any> =>
    request.post(`/customer/sendVerificationCode?email=${email}`),
  /** 重置密码 */
  resetPassword: (data: any): Promise<any> =>
    request.post(
      `/customer/resetPassword?email=${data?.email}&verificationCode=${data?.verificationCode}`,
      data,
    ),
};
