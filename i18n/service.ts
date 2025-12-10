"use server";

import { cookies, headers } from "next/headers";

import { languages, defaultLocale } from "./config";

const COOKIE_LOCALE = "NEXT_LOCALE";
const COOKIE_CURRENCY = "NEXT_CURRENCY";

// =====================
// 语言方法
// =====================
export async function getUserLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_LOCALE)?.value;

  // console.log("服务端 getUserLocale cookie", locale);

  if (locale && languages.some((l) => l.value === locale)) return locale;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") || "";
  const parsedLocale = acceptLanguage?.split(",")[0].split("-")[0] || "";

  // console.log("服务端 getUserLocale 请求头", parsedLocale);
  // console.log("服务端 getUserLocale 默认", defaultLocale);

  return languages.some((l) => l.value === parsedLocale)
    ? parsedLocale
    : defaultLocale;
}
export async function getUserCurrency() {
  const cookieStore = await cookies();
  const currency = cookieStore.get(COOKIE_CURRENCY)?.value;

  console.log("服务端 getUserCurrency ", currency);

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
