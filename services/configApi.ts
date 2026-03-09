import { request } from "./request";

export const configApi = {
  /** 获取货币列表 */
  listCurrencies: (): Promise<any[]> => request.get("/rate"),
  /** 获取商品分类 */
  listCategories: (): Promise<any[]> => request.get("/cargo-category"),
  /** 获取奖金配置 */
  getBonusConfig(): Promise<any> {
    return request.get(`/promotion-config?configType=EXPERIENCE`);
  },
  /** 获取积分兑换优惠券列表 */
  listCoupons(): Promise<any[]> {
    return request.get("/coupon?src=2");
  },
  /** 获取运单增值服务列表 */
  listWarehouseServices(): Promise<any[]> {
    return request.get("/services/query?serviceLevel=2");
  },
  /** 获取订单增值服务列表 */
  listOrderServices: (): Promise<any[]> => {
    return request.get("/services/query?serviceLevel=1");
  },
  /** 获取国家列表 */
  listCountries: (): Promise<any> => {
    return request.get("/countries.json");
  },
  /** 获取省份列表 */
  listProvinces: (countryId: string): Promise<any> => {
    return request.get("/state/country?countryId=" + countryId);
  },
  /** 获取城市列表 */
  listCities: (stateId: string): Promise<any> => {
    return request.get("/cities/state?stateId=" + stateId);
  },
};
