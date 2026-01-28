import { request, requestWithOption } from "./request";

/** 包裹列表 */
export const getPackageList = (data: any) =>
  request.post("/waybill/page", data);

/** 包裹批量支付 */

export const batchPayPackage = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/waybill/pay/preview/init", method: "POST", data },
    { showToast: true },
  );
};
/** 包裹取消预览 */

export const refundPrePayPackage = (id: string): Promise<any> => {
  return request.put(`/waybill/cancel/preview/${id}`);
};

/** 包裹取消 */
export const refundPayPackage = (id: string): Promise<any> => {
  return requestWithOption(
    { url: `/waybill/cancel/${id}`, method: "put" },
    { showToast: true },
  );
};

/** 包裹更换路线预览 */

export const changePrePayPackage = (id: string): Promise<any> => {
  return request.get(`/waybill/change/line/fee?id=${id}`);
};
/** 包裹更换路线提交 */

export const changePayPackage = (data: any): Promise<any> => {
  return request.post(`/waybill/change/line`, data);
};
/** 包裹物流查询 */

export const routePackage = (params: any): Promise<any> => {
  return request.get(`/track`, { params });
};
/** 包裹收货 */

export const ReceiptPackage = (outboundPackingId: string): Promise<any> => {
  return request.put(`/waybill/sign?outboundPackingId=${outboundPackingId}`);
};
