import { request } from "./request";

import {
  createOrderByRechargeParams,
  CreateOrderPreviewKeyByCartParams,
  createOrderPreviewKeyByProductParams,
  OrderPreviewByCart,
} from "@/types";

/** 创建立即购买订单预览key */
export const createOrderPreviewKeyByProduct = (
  data: createOrderPreviewKeyByProductParams,
): Promise<string> => request.post("/orders/preview/init", data);
/** 创建购物车结算订单预览key */
export const createOrderPreviewKeyByCart = (
  data: CreateOrderPreviewKeyByCartParams,
): Promise<string> => {
  return request.post("/customer/cart/order/init", data);
};
/** 创建充值订单 */
export const createOrderByRecharge = (
  data: createOrderByRechargeParams,
): Promise<string> => request.post("/customer/wallet/recharge", data);
/** 创建立即购买订单 */
export const createOrderByProduct = (
  data: createOrderPreviewKeyByProductParams,
): Promise<string> => request.post("/orders/create", data);

/** 创建购物车结算订单 */
export const createOrderByCart = (data: any): Promise<string> =>
  request.post("/customer/cart/order/submit", data);

/** 更新购物车结算订单预览 */
export const updateOrderPreviewCart = (
  data: OrderPreviewByCart,
): Promise<OrderPreviewByCart> =>
  request.post("/customer/cart/order/preview", data);

/** 更新商品立即购买订单预览 */
export const updateOrderPreviewProduct = (
  data: any,
): Promise<OrderPreviewByCart> => request.post("/orders/preview", data);
