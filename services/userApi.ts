import { request } from "./request";
import { encryptField } from "@/lib/encrypt";

export const userApi = {
  /** 获取用户信息 */
  getUserInfo: (): Promise<any> => request.get("/customer/detail"),
  /** 更新用户信息 */
  updateUserInfo: (data: any): Promise<any> =>
    request.post(`/customer/update`, data),
  /** 变更密码 */
  changePassword: async (data: any): Promise<any> => {
    const encryptedData = await encryptField(data);

    return request.post(`/customer/password`, encryptedData);
  },
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
  resetPassword: async (data: any): Promise<any> => {
    // 备份原始数据用于 URL 参数（如果后端要求 URL 参数不加密）
    // 但根据用户要求，我们直接对整个对象应用加密包裹
    const encryptedData = await encryptField(data);

    return request.post(
      `/customer/resetPassword?email=${data?.email}&verificationCode=${data?.verificationCode}`,
      encryptedData,
    );
  },
};
