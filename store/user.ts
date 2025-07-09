// /store/user.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UserState } from "@/types";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage), // 直接传对象，而不是函数
    },
  ),
);
