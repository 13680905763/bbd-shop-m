import { request } from "./request";

export interface UpdateCartData {
  id: string;
  quantity?: number;
  remark?: string;
}
export interface DeleteCartData {
  idList: string[];
}
export interface SubmitCartData {
  previewList: {
    cartId: number;
    serviceList: any[];
  }[];
}

export const cartApi = {
  /** 获取购物车列表（按店铺分组） */
  list: (): Promise<any> => request.get("/customer/cart/shop"),
  /** 添加商品到购物车 */
  add: (data: any): Promise<any> => request.post("/customer/cart/add", data),
  /** 从购物车删除商品 */
  delete: (data: DeleteCartData): Promise<any> => request.post("/customer/cart/delete", data),
  /** 更新购物车商品信息 */
  update: (data: UpdateCartData[]): Promise<any> => request.post("/customer/cart/update", data),
  /** 提交购物车获取订单预览 key */
  submit: (data: SubmitCartData): Promise<string> => request.post("/customer/cart/order/init", data),
};
