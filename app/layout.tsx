import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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
  const initialLocale = await getLocale();
  const messages = await getMessages();

  console.log("服务端initialLocale", initialLocale);

  return (
    <html suppressHydrationWarning lang={initialLocale}>
      <head />
      <body className="bg-[#f5f5f5]">
        <ViewportFixer />
        <NextIntlClientProvider messages={messages}>
          <Providers
            initialLocale={initialLocale}
            themeProps={{ attribute: "class", defaultTheme: "light" }}
          >
            {/* <Suspense fallback={<FullscreenLoader />}>{children}</Suspense> */}
            <Suspense>{children}</Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
