export interface HistoryProduct {
  id: string;
  createTime: string;
  updateTime: string;
  customerId: number;
  source: string;
  sourceProductId: string;
  productTitle: string;
  productUrl: string;
  productPicUrl: string;
  collection: number;
  price?: number | string;
}
