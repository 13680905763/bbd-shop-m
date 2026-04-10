import { request } from "./request";

export const chatApi = {
  /** 上传聊天图片 */
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request.post("/service-chat/upload", formData,);
  },

  /** 分页获取聊天历史消息 */
  listMessages: (customerId: number | string, current: number) =>
    request.get("/service-chat/chatRecord", {
      params: { customerId, current },
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
};
