// /store/useGlobalStore.ts
import { create } from "zustand";

import { defaultCurrency, defaultLocale } from "@/i18n/config";

interface GlobalState {
  locale: string;
  currency: string;
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  locale: defaultLocale,
  currency: defaultCurrency,
  setLocale: (locale) => set({ locale }),
  setCurrency: (currency) => set({ currency }),
}));
