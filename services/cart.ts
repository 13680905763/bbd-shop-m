import { request } from "./request";
// 商品 SKU 信息
export interface CartItemSku {
  propId_valueId: string;
  propName_valueName: string;
}

// 单个商品
export interface CartItem {
  id: string;
  createTime: string;
  updateTime: string;
  customerId: number;
  shopId: string;
  shopName: string;
  source: string; // 如 "TAOBAO"
  sourceProductId: string;
  sourceMpId: string;
  sourceSkuId: string;
  sourceMpSkuId: string;
  productId: number;
  productTitle: string;
  productSkuId: number;
  productUrl: string;
  picUrl: string;
  skuPicUrl: string;
  quantity: number;
  unitPrice: number;
  postFee: number;
  totalFee: number;
  status: number;
  sku: CartItemSku;
}

// 店铺 + 商品列表结构
export interface CartShopGroup {
  shopId: string;
  shopName: string;
  cartList: CartItem[];
}

// 整体购物车返回结构（数组）
export type CartListResponse = CartShopGroup[];

export const deleteCart = (data: any): Promise<string> => {
  return request.post("/customer/cart/delete", data);
};
export const addCart = (data: any): Promise<string> => {
  return request.post("/customer/cart/add", data);
};
export const updateCart = (data: any): Promise<string> => {
  return request.post("/customer/cart/update", data);
};
export const getCartList = (): Promise<CartListResponse> => {
  return request.get("/customer/cart/shop");
};
