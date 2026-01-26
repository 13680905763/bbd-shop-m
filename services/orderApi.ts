import { OrderListParams } from "@/types";
import { request, requestWithOption } from "./request";

export const OrderApi = {
    /** 获取订单列表 */
    listOrder: (data: OrderListParams): Promise<any> => request.post("/orders/page", data),
    listRefundOrder: (data: any): Promise<any> => {
        return request.post("/order-refund/list", data);
    },
    /** 订单取消 */
    cancelOrder: (orderId: string): Promise<any> => {
        return request.put(`/orders/cancel?orderId=${orderId}`);
    },
    /** 批量支付订单 */
    batchPayOrder: (data: any): Promise<any> => {
        return request.post(
            "/orders/pay/preview/init",
            data,
        );
    },
    /** 订单退款 */
    refundOrder: (data: any): Promise<any> => {
        return request.post(
            "/order-refund/applyRefund",
            data,
        );
    },
    /** 订单退款撤销 */
    revokeOrder: (id: string): Promise<any> => {
        return request.put(`/order-refund/cancelApplyRefund/${id}`);
    }
}