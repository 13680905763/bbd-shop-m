import type { PageResult } from "@/types/api";
import type {
  CreateWaybillPreviewParams,
  WarehousePackageItem,
  WarehousePackageListParams,
} from "@/types/warehouse";

import { request } from "./request";

export const warehouseApi = {
  /** 获取包裹分页列表 */
  listPackages: (
    params: WarehousePackageListParams,
  ): Promise<PageResult<WarehousePackageItem>> =>
    request.post("/waybill/package/page", params),
  /** 创建运单预览（返回 previewKey） */
  createWaybillPreview: (data: CreateWaybillPreviewParams): Promise<string> =>
    request.post("/waybill/preview/init", data),
  /** 获取运单预览详情 */
  getWaybillPreview: (previewKey: string): Promise<any> =>
    request.get(`/waybill/preview/key`, { params: { key: previewKey } }),
  /** 提交运单获取路线模板 */
  listLineByWaybill: (data: any): Promise<any> =>
    request.post("/shipping-line-template/query", data),
  /** 估算费用获取路线模板  */
  listLineEstimate: (data: any): Promise<any> =>
    request.post("/shipping-line-template/estimate", data),
  /** 获取运单费用估算 */
  getWaybillFeeEstimate: (data: any): Promise<any> =>
    request.post(`/waybill/preview`, data),
  /** 创建运单 */
  createWaybill: (data: any): Promise<any> =>
    request({ url: "/waybill/submit", method: "POST", data }),
};
