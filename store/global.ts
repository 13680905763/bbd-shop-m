"use client";

import { create } from "zustand";

import { getCurrency } from "@/services";

interface GlobalState {
  language: string;
  currency: any;
  languages: { label: string; value: string }[];
  currencies: { label: string; value: string; symbol: string }[];
  setLanguage: (language: string) => void;
  setCurrency: (currency: any) => void;
  fetchConfig: () => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // ⚠️ 不在顶层直接读 localStorage
  language: "en",
  currency: { label: "CNY", value: "CNY", symbol: "¥" },
  languages: [],
  currencies: [],

  setLanguage: (language) => {
    set({ language });
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  },

  setCurrency: (currency) => {
    set({ currency });
    if (typeof window !== "undefined") {
      localStorage.setItem("currency", JSON.stringify(currency));
    }
  },

  fetchConfig: async () => {
    const res: any = await getCurrency();

    set({
      currencies: res.map((item: any) => ({
        label: item?.currency,
        value: item?.currency,
        symbol: item?.symbol,
      })),
    });
  },
}));

// ✅ 这个 effect 只在浏览器执行，用来从 localStorage 恢复数据
if (typeof window !== "undefined") {
  const storedLang = localStorage.getItem("language");
  const storedCurrency = localStorage.getItem("currency");

  console.log("storedLang", storedLang);
  console.log("currency", JSON.parse(storedCurrency as string));

  if (storedLang) {
    useGlobalStore.setState({ language: storedLang });
  }

  if (storedCurrency) {
    try {
      useGlobalStore.setState({
        currency: JSON.parse(storedCurrency),
      });
    } catch (err) {
      console.warn("解析 currency 失败", err);
    }
  }
}
