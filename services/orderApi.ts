import { request } from "./request";

import { OrderListParams } from "@/types";

export const OrderApi = {
  /** 购物车结算订单预览 */
  previewOrderByCart: (key: string): Promise<any> =>
    request.get(`/customer/cart/order/preview/key?key=${key}`),
  /** 商品结算订单预览 */
  previewOrderByProduct: (key: string): Promise<any> =>
    request.get(`/orders/preview/key?key=${key}`),

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
};
