"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";

import { queryClient } from "@/lib/react-query";
import { initI18n } from "@/lib/i18n";
import AuthGuard from "@/components/auth/auth-guard";

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

export function Providers({
  children,
  themeProps,
  initialLocale,
  initialCurrency,
}: ProvidersProps) {
  const router = useRouter();
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    const loadI18n = async () => {
      try {
        const instance = await initI18n();

        setI18nInstance(instance);
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
      }
    };

    loadI18n();
  }, []);
  // 等待 i18n 初始化完成
  if (!i18nInstance) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-2 text-sm text-gray-500">初始化语言...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
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
    </I18nextProvider>
  );
}
