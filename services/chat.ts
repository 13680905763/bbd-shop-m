import { request } from "./request";

/**
 * 上传聊天图片
 * @param file 图片文件
 * @returns 返回后端响应
 */
export const uploadChatImage = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await request.post("/service-chat/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 明确告知服务器这是一个表单数据
      },
    });

    return response;
  } catch (error) {
    console.error("聊天图片上传失败:", error);
    throw error;
  }
};

// 获取聊天历史
export async function fetchChatHistory(
  customerId: number | string,
  current: number,
) {
  return request(
    `/service-chat/chatRecord?customerId=${customerId}&current=${current}`,
  ); // 返回最近 20 条消息
}
