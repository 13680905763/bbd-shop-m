import { request, } from "./request";

import { WalletInfo } from "@/types";

export const walletApi = {
  /** 获取钱包信息 */
  getWalletInfo: (): Promise<WalletInfo> => request.get("/customer/wallet/info"),
  /** 获取钱包明细 */
  listWalletDetail: (params: {
    current: number;
    size: number;
  }): Promise<any> => request.get(`/customer/wallet/detail/page`, { params }),
  /** 获取积分列表 */
  listPoints: (params: {
    current: number;
    size: number;
  }): Promise<any> => request.post(`/customer-points-detail`, params),
  /** 获取优惠券列表 */
  listCoupon: (params: { status?: number | string }): Promise<any> => request.get(`/customer-coupon`, { params }),
  /** 兑换优惠券 */
  pointExchangeCoupon: (couponId: number | string): Promise<any> => request.post(
    `/customer-coupon/exchange?couponId=${couponId}`,
  ),
  /** 兑换码兑换优惠券 */
  codeExchangeCoupon: (redemptionCode: string): Promise<any> => request.post(
    `/customer-coupon/redemptionCodeCoupons?redemptionCode=${redemptionCode}`,
  ),
  /** 获取支付方式列表 */
  listPaymentMethod: (params: {
    bizCode: string;
    customerCouponId?: string;
  }): Promise<any> =>
    request.get("/customer/pay-order/preview", {
      params,
    }),
  /** 支付 */
  pay: (params: {
    bizCode: string;
    paymentId: string | number;
    addressId: number | string;
    customerCouponId?: string;
  }): Promise<any> =>
    request.post(`/customer/pay-order/create`, params,)
  ,
  /** 支付回调 */
  payNotice: (param: any): Promise<any> => {
    return request.get("/onlypay/callback/redirect?" + param);
  },

  /** PayPal 支付回调 */
  payPaypel: (param: any): Promise<any> => {
    return request.get("/paypal/return/redirect?" + param);
  },
  /** 申请提现 */
  applyWithdrawal(data: {
    currencyAmount: number;
    currencyCode: string;
  }): Promise<any> {
    return request.post("/customer-withdrawal/apply", data);
  },
  /** 获取提现流水列表 */
  listWithdrawalHistory(params: {
    current: number;
    size: number;
  }): Promise<any> {
    return request.post("/customer-withdrawal/page", params);
  },
};
