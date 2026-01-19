import { request, requestWithOption } from "./request";

/** 仓库列表 */
export const getWarehouseList = (data: any) =>
  request.post("/waybill/package/page", data);
/** 创建结算包裹预览key */
export const createWarehousePreviewKeyByCart = (data: any): Promise<string> => {
  return request.post("/waybill/preview/init", data);
};
/** 包裹结算订单预览 */
export const getWarehousePreview = (key: string): Promise<any> =>
  request.get("/waybill/preview/key?key=" + key);

/** 获取增值服务列表 */
export const getWarehouseServices = (): Promise<any> =>
  request.get("/services/query?serviceLevel=2");
/** 获取运费模板 */
export const getWarehouseRoutesList = (): Promise<any> =>
  request.get("/shipping-line-template/all");
/** 获取运费模板 根据货物类别跟国家*/
export const getRoutesByQuery = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/shipping-line-template/query", method: "POST", data },
    { showToast: true, isSuccess: false },
  );
};
/** 获取运费模板 */
export const searchWarehouseRoutesList = (data: any): Promise<any> => {
  return requestWithOption(
    { url: "/shipping-line-template/estimate", method: "POST", data },
    { showToast: true, isSuccess: false },
  );
};

export const createWaybill = (data: any): Promise<any> =>
  request.post("/waybill/submit", data);
/** 创建立即购买订单 */
