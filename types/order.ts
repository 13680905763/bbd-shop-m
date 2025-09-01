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

export interface GetOrderListParams {
  current: number;
  size: number;
  customerPayStatusCode?: string; // ✅ 可选，用于筛选订单状态
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
