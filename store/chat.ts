import { create } from "zustand";

interface ChatStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pendingOrder: any | null;
  setPendingOrder: (order: any | null) => void;
  pendingWaybill: any | null;
  setPendingWaybill: (waybill: any | null) => void;
  chatMode: "COMMON" | "ORDER" | "WAYBILL";
  setChatMode: (mode: "COMMON" | "ORDER" | "WAYBILL") => void;
  activeBizCode: string | null;
  setActiveBizCode: (code: string | null) => void;
  resetToCommon: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  pendingOrder: null,
  setPendingOrder: (order) => set({ pendingOrder: order }),
  pendingWaybill: null,
  setPendingWaybill: (waybill) => set({ pendingWaybill: waybill }),
  chatMode: "COMMON",
  setChatMode: (chatMode) => set({ chatMode }),
  activeBizCode: null,
  setActiveBizCode: (activeBizCode) => set({ activeBizCode }),
  resetToCommon: () =>
    set({ chatMode: "COMMON", activeBizCode: null, pendingOrder: null, pendingWaybill: null }),
}));
