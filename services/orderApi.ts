import { request } from "./request";

import { OrderListParams } from "@/types";
export interface DiyOrderParams {
  productLink: string;
  productTitle: string;
  productPic: string[];
  specifications: {
    s1: string;
    s2: string;
    quantity: number;
  }[];
  productPrice: string;
  postage: string;
  remark: string;
  serviceList: {
    serviceId: number;
    quantity: number;
    remark: string;
  }[];
}

export const orderApi = {
  // --- 订单预览 ---
  /** 创建立即购买订单预览key */
  initPreviewByProduct: (data: any): Promise<string> =>
    request.post("/orders/preview/init", data),
  /** 创建购物车结算订单预览key */
  initPreviewByCart: (data: any): Promise<string> =>
    request.post("/customer/cart/order/init", data),
  /** 购物车结算订单预览详情 */
  previewByCart: (key: string): Promise<any> =>
    request.get(`/customer/cart/order/preview/key`, { params: { key } }),
  /** 商品结算订单预览详情 */
  previewByProduct: (key: string): Promise<any> =>
    request.get(`/orders/preview/key`, { params: { key } }),
  /** 更新购物车结算订单预览 */
  updatePreviewByCart: (data: any): Promise<any> =>
    request.post("/customer/cart/order/preview", data),
  /** 更新商品立即购买订单预览 */
  updatePreviewByProduct: (data: any): Promise<any> =>
    request.post("/orders/preview", data),

  // --- 创建订单 ---
  /** 创建立即购买订单 */
  createByProduct: (data: any): Promise<string> =>
    request.post("/orders/create", data),
  /** 创建购物车结算订单 */
  createByCart: (data: any): Promise<string> =>
    request.post("/customer/cart/order/submit", data),
  /** 创建充值订单 */
  createRecharge: (data: any): Promise<string> =>
    request.post("/customer/wallet/recharge", data),

  /** 创建转运订单 */
  forwardingOrder: (data: any): Promise<any> => {
    return request.post("/drop-shipping-order", data);
  },

  /** 获取订单列表 */
  listOrder: (data: OrderListParams): Promise<any> =>
    request.post("/orders/page", data),

  listRefundOrder: (data: any): Promise<any> => {
    return request.post("/order-refund/list", data);
  },
  /** 订单取消 */
  cancelOrder: (orderId: string): Promise<any> => {
    return request.put(`/orders/cancel?orderId=${orderId}`);
  },
  /** 批量支付订单 */
  batchPayOrder: (data: any): Promise<any> => {
    return request.post("/orders/pay/preview/init", data);
  },
  /** 订单退款 */
  refundOrder: (data: any): Promise<any> => {
    return request.post("/order-refund/applyRefund", data);
  },
  /** 订单退款撤销 */
  revokeOrder: (id: string): Promise<any> => {
    return request.put(`/order-refund/cancelApplyRefund/${id}`);
  },
  /** 创建DIY订单 */
  createDiyOrder: (data: DiyOrderParams): Promise<any> => {
    return request.post("/order-diy", data);
  },
  /** 上传图片 */
  uploadDiyImage: (file: File): Promise<string> => {
    const formData = new FormData();

    formData.append("file", file);

    return request.post("/order-diy/uploadImg", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
