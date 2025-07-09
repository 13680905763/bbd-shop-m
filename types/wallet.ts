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
