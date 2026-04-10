import { request } from "./request";

export const configApi = {
  /** 获取货币列表 */
  getCurrencies: (): Promise<any> => request.get("/rate"),
  /** 获取商品分类 */
  getCategories: (): Promise<any> => request.get("/cargo-category"),
  /** 获取奖金配置 */
  getBonusConfig: (): Promise<any> => request.get("/promotion-config?configType=EXPERIENCE"),
  /** 获取积分兑换优惠券列表 */
  getCoupons: (): Promise<any> => request.get("/coupon?src=2"),
  /** 获取运单增值服务列表 */
  getWarehouseServices: (): Promise<any> => request.get("/services/query?serviceLevel=2"),
  /** 获取保险服务列表 */
  getInsuranceServices: (): Promise<any> => request.get("/services/query?serviceLevel=3"),
  /** 获取订单增值服务列表 */
  getOrderServices: (): Promise<any> => request.get("/services/query?serviceLevel=1"),

  /** 获取公共密钥 */
  getPublicKey: (): Promise<any> =>
    request.get("/customer/public-key"),
};
