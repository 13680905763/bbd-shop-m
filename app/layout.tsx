import "@/styles/globals.css";
import type { Viewport, Metadata } from "next";

import { Suspense } from "react";

import { Providers } from "./providers";

// 🎯 静态导出时硬编码值
const staticLocale = "zh";
const staticCurrency = "CNY";

// 🎯 静态导出时直接导入语言文件

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  title: "bbd-shop",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang={staticLocale}>
      <body className="bg-[#f5f5f5]">
        <Providers
          initialCurrency={staticCurrency}
          initialLocale={staticLocale}
          themeProps={{ attribute: "class", defaultTheme: "light" }}
        >
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
