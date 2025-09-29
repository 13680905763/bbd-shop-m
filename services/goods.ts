import { request } from "./request";

export const getGoodsId = (data: any) => {
  return request.post("/product/search/convertLink", data);
};
export const getGoodsInfo = (data: any) => {
  return request.post("/product/search/id", data);
};
export const getGoodsImageId = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await request.post("/product/search/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 明确告知服务器这是一个表单数据
      },
    });

    return response;
  } catch (error) {
    console.error("请求失败:", error);
    throw error;
  }
};
export const getGoodsList = (data: any) => {
  return request.post("/product/search/image", data);
};
