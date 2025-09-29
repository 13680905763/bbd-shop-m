"use client";

import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { Radio, RadioGroup, cn, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { currencies } from "@/i18n/config";
import { setUserCurrency } from "@/i18n/service";
import { useGlobalStore } from "@/store";

const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      size="sm"
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[100%] cursor-pointer rounded-lg p-3 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function CurrencySettingPage() {
  const t = useTranslations("Setting.CurrencyPage"); // ✅ 使用 next-intl
  const router = useRouter();
  const { currency, setCurrency } = useGlobalStore();

  const [tempCurrency, setTempCurrency] = useState<string>(currency);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("保存选择货币:", tempCurrency);
      setCurrency(tempCurrency);
      localStorage.setItem("currency", tempCurrency);
      await setUserCurrency(tempCurrency);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>
      <div className="flex flex-col gap-4 p-2">
        <RadioGroup
          className="w-full"
          value={tempCurrency}
          onValueChange={(val) => setTempCurrency(val as string)}
        >
          {currencies.map((item) => (
            <CustomRadio key={item.value} value={item.value}>
              {item.label}
            </CustomRadio>
          ))}
        </RadioGroup>

        <Button
          className="w-full"
          color="primary"
          isLoading={loading}
          onPress={handleSubmit}
        >
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
