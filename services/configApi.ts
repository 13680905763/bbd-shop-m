import { request } from "./request";

export const configApi = {
  /** 获取货币列表 */
  getCurrency: (): Promise<any[]> => request.get("/rate"),
  /** 获取商品分类 */
  getCategory: (): Promise<any[]> => request.get("/cargo-category"),
  /** 获取奖金配置 */
  getBonusConfig(): Promise<any> {
    return request.get(`/promotion-config?configType=EXPERIENCE`);
  },
  /** 获取积分兑换优惠券列表 */
  listCoupons(): Promise<any[]> {
    return request.get("/coupon");
  },
  /** 获取增值服务列表 */
  listWarehouseServices(): Promise<any[]> {
    return request.get("/services/query?serviceLevel=2");
  },
};
