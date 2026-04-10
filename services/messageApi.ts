import { request } from "./request";

export const messageApi = {
  /** 获取系统通知列表 */
  list: (params: any): Promise<any> =>
    request.get("/system-notice/list", { params }),

  /** 标记单条消息为已读 */
  markAsRead: (id: string | number): Promise<any> =>
    request.put(`/system-notice/${id}`),

  /** 批量删除消息 */
  removeBatch: (ids: number[]): Promise<any> =>
    request.delete("/system-notice/batch", { data: ids }),
};
