// /store/user.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ServicesState } from "@/types";

export const useServicesStore = create<ServicesState>()(
  persist(
    (set) => ({
      services: null,
      setServices: (services) => set({ services }),
      clearServices: () => set({ services: null }),
    }),
    {
      name: "services-storage",
      storage: createJSONStorage(() => localStorage), // 直接传对象，而不是函数
    },
  ),
);
