"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getCurrency } from "@/services";

interface GlobalState {
  language: string;
  currency: any;
  languages: { label: string; value: string }[];
  currencies: { label: string; value: string; symbol: string; rate: number }[];
  setLanguage: (language: string) => void;
  setCurrency: (currency: any) => void;
  fetchConfig: () => Promise<void>;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      language: "en",
      currency: { label: "CNY", value: "CNY", symbol: "¥", rate: 1 },
      languages: [],
      currencies: [],

      setLanguage: (language) => {
        set({ language });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      fetchConfig: async () => {
        const res: any = await getCurrency();

        set({
          currencies: res.map((item: any) => ({
            label: item?.currency,
            value: item?.currency,
            symbol: item?.symbol,
            rate: item?.rate,
          })),
        });
      },
    }),
    {
      name: "global-storage", // 存储在 localStorage 中的 key
      storage: createJSONStorage(() => localStorage),
      // 可选：只持久化部分字段
      // partialize: (state) => ({ language: state.language, currency: state.currency }),
    },
  ),
);
