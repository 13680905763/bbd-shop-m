import "@/styles/globals.css";
import { Metadata } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { getUserCurrency } from "@/i18n/service";
import ChatBox from "@/components/common/chatbox";

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

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await getLocale();
  const initialCurrency = await getUserCurrency();

  const messages = await getMessages();

  console.log("服务端initialLocale", initialLocale);

  return (
    <html suppressHydrationWarning lang={initialLocale}>
      <head />
      <body>
        {/* <ViewportFixer /> */}
        <NextIntlClientProvider messages={messages}>
          <Providers
            initialCurrency={initialCurrency}
            initialLocale={initialLocale}
            themeProps={{ attribute: "class", defaultTheme: "light" }}
          >
            {/* <Suspense fallback={<FullscreenLoader />}>{children}  <ChatBox /></Suspense> */}
            <Suspense>
              {children}
              <ChatBox />
            </Suspense>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
