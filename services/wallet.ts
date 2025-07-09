import { request } from "./request";

import { WalletInfo } from "@/types";

/** 获取钱包信息 */
export const getWalletInfo = (): Promise<WalletInfo> => {
  return request.get("/customer/wallet/info");
};
export const getWalletDetailList = (
  current: number,
  size: number,
): Promise<any> =>
  request.get(`/customer/wallet/detail/page?current=${current}&size=${size}`);
