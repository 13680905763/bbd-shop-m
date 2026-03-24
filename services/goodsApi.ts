import { request } from "./request";

export const goodsApi = {
  /** 获取浏览记录 */
  listHistory: (): Promise<any> =>
    request.get("/customer-browsing-product/browsingProductList"),

  /** 删除浏览记录 */
  delHistory: (data: string[]): Promise<any> =>
    request.delete("/customer-browsing-product/deleteBrowsingProduct", {
      data,
    }),
  /** 获取收藏列表 */
  listFavorite: (): Promise<any> =>
    request.get("/customer-browsing-product/collectionList"),
  /** 删除收藏 */
  delFavorite: (data: string[]): Promise<any> =>
    request.delete("/customer-browsing-product/deleteCollection", {
      data,
    }),
  /** 收藏/取消收藏商品 */
  favoriteProduct: (data: {
    source: string;
    sourceProductId: string;
    collection: number;
  }): Promise<any> => request.put("/customer-browsing-product", data),

  /** 搜索商品 */
  listSearch: (data: any): Promise<any> =>
    request.post("/product/search/image", data),
  /** 关键字搜索商品 */
  searchKeyword: (data: any): Promise<any> =>
    request.post("/product/search/keyword", data),
};
