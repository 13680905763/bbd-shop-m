import { request } from "./request";

export const promotionApi = {
  /** 获取邀请用户列表（联盟营销/分销） */
  listInvitedUsers: (params: any): Promise<any> =>
    request.post("/customer/inviteList", params),

  /** 获取经验值变动明细（用户等级/成长值） */
  listExperienceDetails: (params: any): Promise<any> =>
    request.post("/customer-experience-detail", params),

  /** 获取奖金/佣金变动明细 */
  listBonusDetails: (params: any): Promise<any> =>
    request.post("/customer-bonus-detail", params),
};
