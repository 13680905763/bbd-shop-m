// hook/useInitLocaleCurrency.ts
import { useEffect, useState } from "react";

import { useGlobalStore } from "@/store";

export function useInitLocaleCurrency() {
  const setLocale = useGlobalStore((s) => s.setLocale);
  const setCurrency = useGlobalStore((s) => s.setCurrency);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const locale = localStorage.getItem("locale");
      const currency = localStorage.getItem("currency");

      if (locale) setLocale(locale);
      if (currency) setCurrency(currency);
      setIsReady(true);
    };

    init();
  }, [setLocale, setCurrency]);

  return isReady;
}
