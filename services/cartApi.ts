// services/cartApi.ts（简化版，使用 any）
import { request, requestWithOption } from "./request";

export const cartApi = {
  /** 获取购物车列表（按店铺分组） */
  getList(): Promise<any> {
    return request.get("/customer/cart/shop");
  },
  /** 添加商品到购物车 */
  addItem(data: any): Promise<any> {
    return requestWithOption(
      {
        url: "/customer/cart/add",
        method: "POST",
        data,
      },
      {
        showToast: true,
      },
    );
  },

  /** 从购物车删除商品 */
  deleteItem(data: any): Promise<any> {
    return request({
      url: "/customer/cart/delete",
      method: "POST",
      data,
    });
  },

  /** 更新购物车商品信息 */
  updateItem(data: any): Promise<any> {
    return request({
      url: "/customer/cart/update",
      method: "POST",
      data,
    });
  },

  /** 创建购物车结算订单预览key */
  createOrderPreview(data: any): Promise<string> {
    return request.post("/customer/cart/order/init", data);
  },
};
