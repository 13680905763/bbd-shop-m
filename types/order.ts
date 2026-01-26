export interface Order {
  id: string;
  bizCode: string;
  status: string;
  // ... 其他订单字段
}

export interface OrderListResponse {
  records: Order[];
  total: number;
  current: number;
  size: number;
  pages?: any;
}

export interface OrderListParams {
  current: number;
  size: number;
  customerPayStatusCode?: string;
  statusCode?: string;
}
export type source = "1688" | "TAOBAO";
export interface createOrderPreviewKeyByProductParams {
  source: source; // 例如 "1688"
  sourceProductId: string;
  sourceSkuId: string;
  sourceMpId?: string;
  sourceMpSkuId?: string;
  specId?: string;
  quantity: number;
  remark?: string;
}
export interface ServiceItem {
  serviceId: number;
  remark: string;
}

export interface PreviewItem {
  cartId: string;
  serviceList: ServiceItem[];
}

export interface CreateOrderPreviewKeyByCartParams {
  previewList: PreviewItem[];
}
export type CurrencyCode = "CNY" | "USD";
export interface createOrderByRechargeParams {
  currencyAmount: number;
  currencyCode: CurrencyCode;
}

// 单个商品
export interface OrderPreviewProductItem {
  productTitle: string;
  sku: {
    propId_valueId: string;
    propName_valueName: string;
  };
  picUrl: string;
  skuPicUrl: string;
  quantity: number;
  price: number;
  postFee: number;
}
// 单个订单（一个店铺）
export interface OrderPreviewOrderItem {
  source: string; // 比如 "TAOBAO"
  shopName: string;
  productFee: number;
  postFee: number;
  serviceFee: number;
  discountFee: number;
  totalFee: number;
  products: OrderPreviewProductItem[];
}
// 请求体结构
export interface OrderPreviewByCart {
  param: CreateOrderPreviewKeyByCartParams;
  orderList: OrderPreviewOrderItem[];
}
// 请求体结构
export interface OrderPreviewByProduct {
  param: createOrderPreviewKeyByProductParams;
  orderList: OrderPreviewOrderItem[];
}

export interface createPayOrderParams {
  bizCode: string;
  paymentId: string | number;
  addressId: number | string;
}
export interface ServicesState {
  services: any;
  setServices: (services: any | null) => void;
  clearServices: () => void;
}

// 新
/** 增值服务关联文件 */
export interface OrderServiceFile {
  id: string;
  /** 文件地址 */
  url?: string;
  /** 文件名 */
  fileName?: string;
  /** 文件类型 */
  fileType?: string;
  /** 时间 */
  createTime: string;
  updateTime: string;
}
/** 订单商品增值服务（实例） */
export interface OrderServiceItem {
  /** 主键 */
  id: string;
  /** 服务定义 */
  serviceId: string;
  serviceCode: string;
  serviceName?: string;
  /** 价格 & 数量 */
  price: string; // ⚠️ 后端字符串
  quantity: number;
  /** 备注 */
  remark?: string;
  /** 关联文件 */
  fileList?: OrderServiceFile[];
  /** 时间 */
  createTime?: string;
  updateTime?: string;
}
export interface ProductSkuSpec {
  propId_valueId: string;
  propName_valueName: string;
}

/** 订单商品 */
export interface OrderProduct {
  /** 主键 */
  id: string;
  /** 商品 */
  productId: string;
  productCode: string;
  productTitle: string;
  /** SKU */
  productSkuId: string;
  productSkuCode: string;
  /** 商品图 */
  picUrl: string;
  skuPicUrl: string;
  /** 店铺 */
  shopId: string;
  shopName: string;
  /** 数量 */
  quantity: number;
  purchaseQuantity: number;
  /** 价格（⚠️ 后端字符串） */
  price: string;
  /** SKU 规格 */
  propAndValue: ProductSkuSpec;
  /** 备注 */
  remark?: string;
  /** 增值服务 */
  orderServiceList: OrderServiceItem[];
  /** 来源 */
  source: string;
  sourceProductId: string;
  sourceSkuId: string;
  sourceMpId?: string;
  sourceMpSkuId?: string;
  /** 退款相关 */
  withdrawRefundFlag: boolean;
  /** 时间 */
  updateTime: string;
}
