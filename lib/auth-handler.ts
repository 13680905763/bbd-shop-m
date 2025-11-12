import { queryClient } from "./react-query";

import { getAddressList, getServicesList, getUserInfo } from "@/services";
import { useBillingAddressStore, useUserStore } from "@/store";
import { useWalletStore } from "@/store";
import { getWalletInfo } from "@/services/wallet";
import { useServicesStore } from "@/store/services";

export async function handleAuthSuccess() {
  const [user, wallet, billing, services] = await Promise.all([
    getUserInfo(),
    getWalletInfo(),
    getAddressList(2).then((res) => res[0] || {}),
    getServicesList(),
  ]);

  useUserStore.getState().setUser(user);
  useWalletStore.getState().setWallet(wallet);
  useBillingAddressStore.getState().setBillingAddress(billing);
  useServicesStore.getState().setServices(services);
  queryClient.setQueryData(["userInfo"], user);
  queryClient.setQueryData(["walletInfo"], wallet);
  queryClient.setQueryData(["billingAddress"], billing);
  queryClient.setQueryData(["services"], services);
}
