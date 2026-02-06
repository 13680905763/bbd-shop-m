import { request } from "./request";

export const userApi = {
  /** 获取用户信息 */
  getUserInfo(): Promise<any> {
    return request.get("/customer/detail");
  },
  /** 获取用户经验 */
  getExperience(): Promise<any> {
    return request.get(`/customer-experience/myExperience`);
  },
  /** 获取经验明细 */
  listExperience(params: any): Promise<any> {
    return request.get(`/customer-experience-detail`, {
      params,
    });
  },
 
};
