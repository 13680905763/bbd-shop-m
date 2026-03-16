"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import "antd-mobile/es/global"; // 🎯 关键：引入全局样式
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryClient } from "@/lib/react-query";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { ConfirmProvider } from "@/components/common";
import { useCurrencyOptions } from "@/hook/api/useConfig";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  initialLocale?: any;
  initialCurrency?: any;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

function ConfigSync() {
  const { data } = useCurrencyOptions();
  const { setCurrencies } = useGlobalStore();

  useEffect(() => {
    if (data) {
      setCurrencies(data);
    }
  }, [data, setCurrencies]);

  return null;
}

export function Providers({
  children,
  themeProps,
  initialLocale,
  initialCurrency,
}: ProvidersProps) {
  const router = useRouter();
  const { setLanguage, setCurrency } = useGlobalStore();

  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    const init = async () => {
      console.log("初始化 store 服务端拿到", initialLocale, initialCurrency);
      // await fetchConfig(); // 等待异步执行完成
      await setLanguage(initialLocale);
      await setCurrency(initialCurrency);
      console.log("初始化 store 语言货币完成");
      setReady(true);
    };

    init();
  }, []);
  if (!ready) return <FullscreenLoader />;

  return (
    <GoogleOAuthProvider clientId="22212018787-g78t3vahfu3re7rphmcimrkpngf0b79i.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <ConfigSync />
        <HeroUIProvider navigate={router.push}>
          <ToastProvider
            placement="top-center"
            toastProps={{
              timeout: 2000,
            }}
          />
          <ConfirmProvider>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </ConfirmProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
