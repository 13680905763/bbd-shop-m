"use client";

import { useEffect } from "react";
import { useGlobalStore, useUserStore, useWalletStore } from "@/store";
import { getWalletInfo } from "@/services/wallet";

export default function StoreInitializer() {
  const { user } = useUserStore();
  const { wallet, setWallet } = useWalletStore();
  const { fetchConfig, currencies } = useGlobalStore();

  useEffect(() => {
    const initData = async () => {
      // 1. 初始化货币配置 (如果为空则获取)
      if (currencies.length === 0) {
        try {
          await fetchConfig();
        } catch (error) {
          console.error("Failed to fetch currency config:", error);
        }
      }

      // 2. 初始化钱包 (如果用户已登录但没有钱包信息)
      if (user && !wallet) {
        try {
          const res = await getWalletInfo();
          setWallet(res);
        } catch (error) {
          console.error("Failed to fetch wallet info:", error);
        }
      }
    };

    initData();
  }, [user, wallet, setWallet, fetchConfig, currencies.length]);

  return null;
}
