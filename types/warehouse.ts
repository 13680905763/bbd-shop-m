import { OrderProduct } from "./order";
export interface WarehousePackageListParams {
  current: number;
  size: number;
  statusCode?: string;
}
/** 创建结算包裹预览 Key - 入参 */
export interface CreateWaybillPreviewParams {
  /** 包裹ID集合 */
  packageSet: string[];
}
/** 仓库包裹明细 */
export interface WarehousePackageItem {
  /** 包裹ID */
  id: string;

  /** 包裹编码 */
  packageCode: string;

  /** 入库单 */
  inboundId: string;
  inboundCode: string;
  inboundInspectionId: string;

  /** 订单 */
  orderId: string;
  orderCode: string;

  /** 订单商品 */
  orderProductId: string;
  orderProduct?: OrderProduct;

  /** 采购 */
  purchaseId: string;
  purchaseCode: string;

  /** 分类 */
  categoryId: string;
  categoryName: string;

  /** 尺寸重量 */
  length: number;
  width: number;
  height: number;
  weight: number;

  /** 数量 */
  quantity: number;
  outboundQuantity: number;
  returnQuantity: number;

  /** 状态 */
  status: string;
  statusCode: string;

  /** 来源 */
  source: string;
  sourceProductId: string;
  sourceSkuId: string;

  /** 使用中标识 */
  inUse: number;

  /** 操作人 */
  userId: string;
  userName: string;
  updateId: string;
  updateName: string;

  /** 时间 */
  createTime: string;
  updateTime: string;
}
