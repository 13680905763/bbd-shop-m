import { request } from "./request";

export interface UpdateCartParams {
  id: string;
  quantity?: number;
  remark?: string;
}
export interface DeleteCartParams {
  idList: string[];
}
export interface CheckoutParams {
  previewList: {
    cartId: number;
    serviceList: any[];
  }[];
}

export const cartApi = {
  /** 获取购物车详情快照 */
  getDetail: (): Promise<any> => request.get("/customer/cart/shop"),

  /** 添加商品到购物车 */
  addItem: (data: any): Promise<any> => request.post("/customer/cart/add", data),

  /** 批量删除购物车商品 */
  removeItems: (data: DeleteCartParams): Promise<any> => request.post("/customer/cart/delete", data),

  /** 批量更新商品数量或备注 */
  updateItems: (data: UpdateCartParams[]): Promise<any> => request.post("/customer/cart/update", data),

  /** 提交并准备订单 */
  prepareOrder: (data: CheckoutParams): Promise<string> => request.post("/customer/cart/order/init", data),
};
