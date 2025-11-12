"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryClient } from "@/lib/react-query";
import { useGlobalStore } from "@/store";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const { fetchConfig, currency, language, currencies } = useGlobalStore();

  useEffect(() => {
    const init = async () => {
      console.log("初始化 store");
      await fetchConfig(); // 等待异步执行完成

      // await setUserLocale(language);
    };

    init();
  }, []);
  // useEffect(() => {
  //   fetchConfig();
  // }, []);

  return (
    <GoogleOAuthProvider clientId="545953191162-n0elu4ilreo1hdlptkgublu7bjegpp0u.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider navigate={router.push}>
          <ToastProvider
            placement="top-center"
            toastProps={{
              timeout: 1000,
            }}
          />
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
