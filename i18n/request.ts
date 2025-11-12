import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "./service";
import { defaultLocale } from "./config";

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) || defaultLocale;

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/lang/${locale}.json`,
  // );
  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
