import { request } from "./request";

export const PromotionApi = {
  /** 获取邀请用户列表 */
  listInvitedUsers(params: any): Promise<any> {
    return request.post("/customer/inviteList", params);
  },
  /** 获取经验明细 */
  listExperience(params: any): Promise<any> {
    return request.post(`/customer-experience-detail`, params);
  },
  /** 获取奖金明细 */
  listBonus(params: any): Promise<any[]> {
    return request.post("/customer-bonus-detail", params);
  },
};
