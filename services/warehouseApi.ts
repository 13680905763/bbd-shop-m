// services/warehouseApi.ts
import type { PageResult } from "@/types/api";
import type {
  CreateWaybillPreviewParams,
  WarehousePackageItem,
  WarehousePackageListParams,
} from "@/types/warehouse";

import { request, requestWithOption } from "./request";

export const warehouseApi = {
  /** 获取包裹分页列表 */
  listPackages(
    params: WarehousePackageListParams,
  ): Promise<PageResult<WarehousePackageItem>> {
    return request.post("/waybill/package/page", params);
  },
  /** 获取增值服务列表 */
  listServices(): Promise<any[]> {
    return request.get("/services/query?serviceLevel=2");
  },
  /** 创建运单预览（返回 previewKey） */
  createWaybillPreview(data: CreateWaybillPreviewParams): Promise<string> {
    return request.post("/waybill/preview/init", data);
  },
  /** 获取运单预览详情 */
  getWaybillPreview(previewKey: string): Promise<any> {
    return request.get(`/waybill/preview/key?key=${previewKey}`);
  },
  /** 获取运单费用估算 */
  getWaybillFeeEstimate(data: any): Promise<any> {
    return request.post(`/waybill/preview`, data);
  },
  /** 创建运单 */
  createWaybill(data: any): Promise<any> {
    return requestWithOption(
      { url: "/waybill/submit", method: "POST", data },
      { showToast: true },
    );
  },
};
