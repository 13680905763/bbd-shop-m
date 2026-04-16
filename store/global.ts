"use client";

import { create } from "zustand";

interface GlobalState {
  language: string;
  currency: any;
  languages: { label: string; value: string }[];
  currencies: {
    label: string;
    value: string;
    symbol: string;
    rate: number;
    isLocal?: boolean;
  }[];
  setLanguage: (language: string) => void;
  setCurrency: (currency: any) => void;
  setCurrencies: (res: any[]) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // ⚠️ 不在顶层直接读 localStorage
  language: "en",
  currency: { label: "USD", value: "USD", symbol: "$", rate: 1, isLocal: true },
  // currency: null,
  languages: [],
  currencies: [],

  setLanguage: (language) => {
    set({ language });
  },

  setCurrency: (currency) => {
    set({ currency });
  },

  setCurrencies: (res) => {
    set({
      currencies: res.map((item: any) => ({
        label: item?.currency,
        value: item?.currency,
        symbol: item?.symbol,
        rate: item?.rate,
      })),
    });
  },
}));
