"use server";

import { cookies, headers } from "next/headers";

import { languages, defaultLocale } from "./config";

const COOKIE_LOCALE = "NEXT_LOCALE";
const COOKIE_CURRENCY = "NEXT_CURRENCY";

export async function getUserLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_LOCALE)?.value;

  if (locale && languages.some((l) => l.value === locale)) return locale;
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") || "";
  const parsedLocale = acceptLanguage?.split(",")[0].split("-")[0] || "";

  return languages.some((l) => l.value === parsedLocale)
    ? parsedLocale
    : defaultLocale;
}
export async function getUserCurrency() {
  const cookieStore = await cookies();
  const currency = cookieStore.get(COOKIE_CURRENCY)?.value;

  return currency
    ? JSON.parse(currency)
    : { label: "CNY", value: "CNY", symbol: "¥", rate: 1 };
}
export async function setUserLocale(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_LOCALE,
    value: locale,
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 5, // 5 年
  });
}
export async function setUserCurrency(currency: any) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_CURRENCY,
    value: JSON.stringify(currency),
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 5, // 5 年
  });
}
