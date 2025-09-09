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
