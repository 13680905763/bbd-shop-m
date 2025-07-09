import { addToast } from "@heroui/react";

import { queryClient } from "./react-query";

import { getUserInfo } from "@/services";
import { useUserStore } from "@/store";
import { useWalletStore } from "@/store";
import { getWalletInfo } from "@/services/wallet";

export async function handleAuthSuccess(
  redirect: string,
  resMessage?: string,
  router?: ReturnType<typeof import("next/navigation").useRouter>,
) {
  const userInfo = await getUserInfo();
  const walletInfo = await getWalletInfo();
  const billingAddress = await getWalletInfo();

  useUserStore.getState().setUser(userInfo);
  useWalletStore.getState().setWallet(walletInfo);
  queryClient.setQueryData(["userInfo"], userInfo);
  queryClient.setQueryData(["walletInfo"], walletInfo);
  queryClient.setQueryData(["billingAddress"], billingAddress);

  window.location.reload();
  if (resMessage) {
    addToast({ title: resMessage, timeout: 1000, color: "success" });
  }

  router?.push(redirect);
}
