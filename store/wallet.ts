// /store/user.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { WalletState } from "@/types";

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallet: null,
      setWallet: (wallet) => set({ wallet }),
      clearWallet: () => set({ wallet: null }),
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => localStorage), // 直接传对象，而不是函数
    },
  ),
);
