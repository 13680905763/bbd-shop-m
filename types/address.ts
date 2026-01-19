/**
 * 地址类型
 * 1: 收货地址
 * 2: 账单地址
 */
export type AddressType = 1 | 2;

/**
 * 默认地址标记
 * 0: 非默认地址
 * 1: 默认地址
 */
export type DefaultAddress = 0 | 1;

/**
 * 地址信息接口
 */
export interface Address {
  /** 地址ID */
  id: string;

  /** 详细地址 */
  address: string;

  /** 地址类型 */
  addressType: AddressType;

  /** 城市 */
  city: string;

  /** 国家名称 */
  country: string;

  /** 国家ID */
  countryId: number;

  /** 国家ISO2代码 */
  countryIso2: string;

  /** 国家ISO3代码 */
  countryIso3: string;

  /** 创建时间 */
  createTime: string;

  /** 客户ID */
  customerId: string;

  /** 是否为默认地址 */
  defaultAddress: DefaultAddress;

  /** 门牌号 */
  doorNo: string;

  /** 手机号 */
  phone: string;

  /** 邮编 */
  postcode: string;

  /** 收件人 */
  recipient: string;

  /** 州/省 */
  state: string;

  /** 州/省ID */
  stateId: number;

  /** 州/省ISO2代码 */
  stateIso2: string;

  /** 更新时间 */
  updateTime: string;
}
export type AddressModalState =
  | { type: null }
  | { type: "add" }
  | { type: "edit"; address: Address }
  | { type: "delete"; address: Address };

export interface BillingAddressState {
  billingAddress: Address | null;
  setBillingAddress: (billingAddress: Address | null) => void;
  clearBillingAddress: () => void;
}
