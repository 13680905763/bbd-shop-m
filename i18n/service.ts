"use server";

import { cookies, headers } from "next/headers";

import {
  languages,
  defaultLocale,
  currencies,
  defaultCurrency,
} from "./config";

const COOKIE_LOCALE = "NEXT_LOCALE";
const COOKIE_CURRENCY = "NEXT_CURRENCY";

// =====================
// 语言方法
// =====================
export async function getUserLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_LOCALE)?.value;

  if (locale && languages.some((l) => l.value === locale)) return locale;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") || "";
  const parsedLocale = acceptLanguage?.split(",")[0].split("-")[0] || "";

  console.log("parsedLocale", parsedLocale, defaultLocale);

  return languages.some((l) => l.value === parsedLocale)
    ? parsedLocale
    : defaultLocale;
}

export async function setUserLocale(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_LOCALE,
    value: locale,
    path: "/",
  });
}

// =====================
// 货币方法
// =====================
export async function getUserCurrency() {
  const cookieStore = await cookies();
  const currency = cookieStore.get(COOKIE_CURRENCY)?.value || "";

  return currencies.some((c) => c.value === currency)
    ? currency
    : defaultCurrency;
}

export async function setUserCurrency(currency: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_CURRENCY,
    value: currency,
    path: "/",
  });
}
