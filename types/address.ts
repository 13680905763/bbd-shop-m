export interface AddressItem {
  id: string; // 地址 ID，注意是字符串类型
  createTime: string; // 创建时间（格式为 yyyy-MM-dd HH:mm:ss）
  updateTime: string; // 更新时间
  customerId: number; // 用户 ID
  recipient: string; // 收件人姓名
  phone: string; // 联系电话
  countryId: number; // 国家 ID
  country: string; // 国家名称
  countryIso2: string; // 国家简码（ISO 2位）
  countryIso3: string; // 国家简码（ISO 3位）
  stateId: number; // 省份 ID
  state: string; // 省份名称
  stateIso2: string; // 省份简码
  city: string; // 城市，注意这里是 string 类型的城市 ID（可能是枚举或代码）
  address: string; // 详细地址
  postcode: string; // 邮编
  addressType: number; // 地址类型（可能是 1：收货地址，2：账单地址等）
  defaultAddress: number; // 是否默认地址（0 否，1 是）
}

export interface BillingAddressState {
  billingAddress: AddressItem | null;
  setBillingAddress: (billingAddress: AddressItem | null) => void;
  clearBillingAddress: () => void;
}
