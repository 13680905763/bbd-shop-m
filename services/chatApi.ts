import { request } from "./request";

export const chatApi = {
  /** 上传聊天图片 */
  uploadImage: (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    return request.post("/service-chat/upload", formData);
  },

  /** 分页获取聊天历史消息 */
  listMessages: (
    customerId: number | string,
    current: number,
    bizCode?: string | null,
  ) =>
    request.get("/service-chat/chatRecord", {
      params: { customerId, current, bizCode },
    }),

  /** 将消息标记为已读 */
  markAsRead: (data: { customerId: number | string; messageIds?: string[] }) =>
    request.put("/service-chat/read", data),

  /** 获取聊天时可选择发送的订单列表（候选订单） */
  listCandidateOrders: (data: any): Promise<any> =>
    request.post("/orders/myOrders", data),
  /** 获取聊天时可选择发送的运单列表（候选运单） */
  listCandidateWaybills: (data: any): Promise<any> =>
    request.post("/waybill/myWaybills", data),

  /** 获取聊天列表集 */
  listChatContexts: (customerId: string | number): Promise<any> =>
    request.get(`/service-chat-list/${customerId}`),

  /** 删除特定的聊天列表项 */
  deleteChatContext: (bizCode: string): Promise<any> =>
    request.delete(`/service-chat-list/${bizCode}`),
};
