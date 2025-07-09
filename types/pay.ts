export interface PaymentItem {
  id: string;
  createTime: string;
  updateTime: string;
  onOffLine: "ONLINE" | "OFFLINE";
  methodCode: string;
  methodName: string;
  methodLogoUrl: string;
  payCode: string;
  payName: string;
  logoUrl: string;
  orderAmount: number;
  handlingFeeRate: number;
  handlingFee: number;
  fixedCost: number;
  payAmount: number;
}

export interface PaymentMethodResponse {
  onOffLine: "ONLINE" | "OFFLINE";
  methodCode: string;
  methodName: string;
  paymentList: PaymentItem[];
}
