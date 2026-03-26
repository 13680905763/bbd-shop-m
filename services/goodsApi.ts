import { request } from "./request";

export const goodsApi = {
  // ========== 浏览记录 ==========
  /** 获取浏览记录列表 */
  getHistoryList: (): Promise<any> => request.get("/customer-browsing-product/browsingProductList"),
  /** 删除浏览记录 */
  deleteHistory: (data: string[]): Promise<any> =>
    request.delete("/customer-browsing-product/deleteBrowsingProduct", {
      data,
    }),

  // ========== 收藏 ==========
  /** 获取收藏列表 */
  getFavoriteList: (): Promise<any> => request.get("/customer-browsing-product/collectionList"),

  /** 删除收藏 */
  deleteFavorite: (data: string[]): Promise<any> =>
    request.delete("/customer-browsing-product/deleteCollection", {
      data,
    }),
  /** 收藏/取消收藏商品 */
  toggleFavorite: (params: ToggleFavoriteParams): Promise<any> => request.put("/customer-browsing-product", params),

  // ========== 搜索 ==========
  /** 
   * 智能搜索（支持链接、商品标题、关键词等）
   * 后端会自动识别并返回对应商品信息
   */
  smartSearch: (data: any): Promise<any> =>
    request.post("/product/search/convertLink", data),
  // /** 以图搜图 */
  searchByImage: (data: any): Promise<any> => request.post("/product/search/image", data),
  /** 关键字搜索 */
  searchByKeyword: (data: any): Promise<any> => request.post("/product/search/keyword", data),

  /** 通过商品ID获取商品详情 */
  getGoodsInfoById: (data: any): Promise<any> =>
    request.post("/product/search/id", data),
  /** 上传图片搜索商品（以图搜图） */
  uploadSearchImage: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await request.post("/product/search/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error("图片上传搜索失败:", error);
      throw error;
    }
  },
};

// ========== 类型定义 ==========

/** 收藏/取消收藏参数 */
export interface ToggleFavoriteParams {
  /** 商品来源 */
  source: string;
  /** 商品ID */
  sourceProductId: string;
  /** 操作类型：1-收藏，0-取消收藏 */
  collection: 0 | 1;
}

