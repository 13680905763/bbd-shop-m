import { create } from "zustand";

interface ChatStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pendingOrder: any | null;
  setPendingOrder: (order: any | null) => void;
  pendingWaybill: any | null;
  setPendingWaybill: (waybill: any | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  pendingOrder: null,
  setPendingOrder: (order) => set({ pendingOrder: order }),
  pendingWaybill: null,
  setPendingWaybill: (waybill) => set({ pendingWaybill: waybill }),
}));
