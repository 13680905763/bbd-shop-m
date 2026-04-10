import { request } from "./request";

export const goodsApi = {
  /** 获取浏览记录列表 */
  getHistoryList: (): Promise<any> => request.get("/customer-browsing-product/browsingProductList"),
  /** 删除浏览记录 */
  deleteHistory: (data: string[]): Promise<any> =>
    request.delete("/customer-browsing-product/deleteBrowsingProduct", {
      data,
    }),

  /** 获取收藏列表 */
  getFavoriteList: (): Promise<any> => request.get("/customer-browsing-product/collectionList"),

  /** 删除收藏 */
  deleteFavorite: (data: string[]): Promise<any> =>
    request.delete("/customer-browsing-product/deleteCollection", {
      data,
    }),
  /** 收藏/取消收藏商品 */
  toggleFavorite: (params: any): Promise<any> => request.put("/customer-browsing-product", params),
};


