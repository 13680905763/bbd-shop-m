import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "./service";
import { defaultLocale } from "./config";

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) || defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
