export interface WalletInfo {
  availabalBalance: number;
  balance: number;
  createTime: string;
  customerId: string;
  frozenBalance: number;
  id: string;
  totalExpense: number;
  totalIncome: number;
  updateTime: string;
  walletNo: string;
}

export interface WalletState {
  wallet: WalletInfo | null;
  setWallet: (wallet: WalletInfo | null) => void;
  clearWallet: () => void;
}

export interface Coupon {
  code?: string;
  couponDenomination?: number;
  couponId?: string;
  couponType?: number;
  couponTypeMsg?: string;
  createTime: string;
  customerId?: string;
  expirationDate?: string | number; // 兼容后端返回的有效期天数 (number)
  id: string;
  inviterEmail?: string;
  src: number;
  srcMsg: string;
  status?: number;
  statusMsg?: string;
  thresholdAmount: number;
  updateTime: string;
  denomination?: number; // 兑换券面额
  title?: string; // 兑换券标题
  type?: number; // 兑换券类型
  typeMsg?: string; // 兑换券类型描述
  createdBy?: string;
  updatedBy?: string;
}
