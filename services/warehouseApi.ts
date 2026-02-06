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
  /** 创建运单预览（返回 previewKey） */
  createWaybillPreview(data: CreateWaybillPreviewParams): Promise<string> {
    return request.post("/waybill/preview/init", data);
  },
  /** 获取运单预览详情 */
  getWaybillPreview(previewKey: string): Promise<any> {
    return request.get(`/waybill/preview/key?key=${previewKey}`);
  },
  /** 获取路线模板 提交运单的时候*/
  listLineByWaybill(data: any): Promise<any> {
    return requestWithOption(
      {
        url: "/shipping-line-template/query",
        method: "POST",
        data,
      },
      { isSuccess: false },
    );
  },
  /** 获取路线模板 估算费用 */
  listLineEstimate(data: any): Promise<any> {
    return requestWithOption(
      { url: "/shipping-line-template/estimate", method: "POST", data },
      { showToast: true, isSuccess: false },
    );
  },
  /** 获取运单费用估算 */
  getWaybillFeeEstimate(data: any): Promise<any> {
    return request.post(`/waybill/preview`, data);
  },
  /** 创建运单 */
  createWaybill(data: any): Promise<any> {
    return request({ url: "/waybill/submit", method: "POST", data });
  },
};
