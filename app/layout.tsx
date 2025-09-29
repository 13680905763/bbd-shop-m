import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { ViewportFixer } from "@/components/viewport-fixer";
import FullscreenLoader from "@/components/common/fullscreen-loader";

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
  const locale = await getLocale();
  const messages = await getMessages();

  console.log("messages", messages);

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body className="bg-[#f5f5f5]">
        <ViewportFixer />
        <NextIntlClientProvider messages={messages}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <Suspense fallback={<FullscreenLoader />}>{children}</Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
