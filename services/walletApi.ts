import { request } from "./request";

import { WalletInfo } from "@/types";

export const walletApi = {
  /** 获取钱包信息 */
  getWalletInfo: (): Promise<WalletInfo> => {
    return request.get("/customer/wallet/info");
  },

  /** 获取钱包明细 */
  getWalletDetailList: (current: number, size: number): Promise<any> => {
    return request.get(
      `/customer/wallet/detail/page?current=${current}&size=${size}`,
    );
  },
  /** 获取优惠券列表 */
  listCoupon(params: { status?: number | string }): Promise<any> {
    return request.get(`/customer-coupon`, {
      params,
    });
  },
  /** 获取支付方式列表 */
  listPaymentMethod: (bizCode: string): Promise<any> =>
    request.get("/customer/pay-order/preview?bizCode=" + bizCode),

  /** 支付回调 */
  payNotice: (param: any): Promise<any> => {
    return request.get("/onlypay/callback/redirect?" + param);
  },

  /** PayPal 支付回调 */
  payPaypel: (param: any): Promise<any> => {
    return request.get("/paypal/return/redirect?" + param);
  },
};
