import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { ViewportFixer } from "@/components/viewport-fixer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className="bg-[#f5f5f5]">
        <ViewportFixer />
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Suspense fallback={<div>加载中...</div>}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
