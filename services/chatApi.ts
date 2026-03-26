import { request } from "./request";

export const chatApi = {
  /** 上传聊天图片 */
  uploadImage: async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    try {
      const response = await request.post("/service-chat/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.error("聊天图片上传失败:", error);
      throw error;
    }
  },
  /** 获取聊天历史 */
  getHistory: (customerId: number | string, current: number) =>
    request.get(
      `/service-chat/chatRecord?customerId=${customerId}&current=${current}`,
    ),
};
