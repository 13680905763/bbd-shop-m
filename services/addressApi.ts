import { request } from "./request";

// 地址类型常量
const ADDRESS_TYPE = {
  SHIPPING: 1, // 收货地址
  INVOICE: 2, // 发票地址
} as const;

export const addressApi = {
  /** 获取收货地址列表 */
  list: (): Promise<any> =>
    request.get("/customer/address/list", {
      params: { addressType: ADDRESS_TYPE.SHIPPING },
    }),

  /** 获取发票地址列表 */
  listInvoice: (): Promise<any> =>
    request.get("/customer/address/list", {
      params: { addressType: ADDRESS_TYPE.INVOICE },
    }),

  /** 创建收货地址 */
  create: (data: any): Promise<any> =>
    request.post("/customer/address/add", {
      ...data,
      addressType: ADDRESS_TYPE.SHIPPING,
    }),

  /** 创建发票地址 */
  createInvoice: (data: any): Promise<any> =>
    request.post("/customer/address/add", {
      ...data,
      addressType: ADDRESS_TYPE.INVOICE,
      defaultAddress: 1,
    }),

  /** 更新地址 */
  update: (data: any): Promise<any> => request.post("/customer/address/update", data),

  /** 删除地址 */
  remove: (id: string | number): Promise<any> => request.post("/customer/address/delete", { id }),

  // --- 系统基础数据 ---
  /** 获取国家列表 */
  listCountries: (): Promise<any> => request.get("/countries.json"),
  /** 获取省份列表 */
  listProvinces: (countryId: string): Promise<any> => request.get("/state/country", { params: { countryId } }),
  /** 获取城市列表 */
  listCities: (stateId: string): Promise<any> => request.get("/cities/state", { params: { stateId } }),
};
