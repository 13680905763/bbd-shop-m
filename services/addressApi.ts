import { request } from "./request";

// 地址类型常量
const ADDRESS_TYPE = {
  SHIPPING: 1, // 收货地址
  INVOICE: 2, // 发票地址
} as const;

export const addressApi = {
  /** 获取收货地址列表 */
  getAddressList: (): Promise<any> =>
    request.get(`/customer/address/list?addressType=${ADDRESS_TYPE.SHIPPING}`),
  /** 获取发票地址列表 */
  getInvoiceAddressList: (): Promise<any> =>
    request.get(`/customer/address/list?addressType=${ADDRESS_TYPE.INVOICE}`),
  /** 添加收货地址 */
  addAddress: (data: any): Promise<any> =>
    request.post("/customer/address/add", {
      ...data,
      addressType: ADDRESS_TYPE.SHIPPING,
    }),
  /** 添加发票地址 */
  addInvoiceAddress: (data: any): Promise<any> =>
    request.post("/customer/address/add", {
      ...data,
      addressType: ADDRESS_TYPE.INVOICE,
      defaultAddress: 1,
    }),
  /** 删除地址 */
  deleteAddress: (data: any): Promise<any> =>
    request.post("/customer/address/delete", data),
  /** 更新地址 */
  updateAddress: (data: any): Promise<any> =>
    request.post("/customer/address/update", data),
};
