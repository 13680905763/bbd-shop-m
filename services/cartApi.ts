import { request } from "./request";

export interface UpdateCartParams {
  id: string;
  quantity?: number;
  remark?: string;
}
export interface DeleteCartParams {
  idList: string[];
}
export interface CheckoutParams {
  previewList: {
    cartId: number;
    serviceList: any[];
  }[];
}

export const cartApi = {
  getCart: (): Promise<any> => request.get("/customer/cart/shop"),
  addItem: (data: any): Promise<any> =>
    request.post("/customer/cart/add", data),
  deleteItem: (data: DeleteCartParams): Promise<any> =>
    request.post("/customer/cart/delete", data),
  updateItem: (data: UpdateCartParams[]): Promise<any> =>
    request.post("/customer/cart/update", data),
  checkout: (data: CheckoutParams): Promise<string> =>
    request.post("/customer/cart/order/init", data),
};
