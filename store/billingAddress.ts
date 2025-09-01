// /store/user.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { BillingAddressState } from "@/types";

export const useBillingAddressStore = create<BillingAddressState>()(
  persist(
    (set) => ({
      billingAddress: null,
      setBillingAddress: (billingAddress) => set({ billingAddress }),
      clearBillingAddress: () => set({ billingAddress: null }),
    }),
    {
      name: "billingAddress-storage",
      storage: createJSONStorage(() => localStorage), // 直接传对象，而不是函数
    },
  ),
);
