"use client";

import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { Radio, RadioGroup, cn, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import { setUserCurrency } from "@/i18n/service";

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
  const t = useTranslations("setting.currencyPage"); // ✅ 使用 next-intl
  const router = useRouter();
  const { currency, setCurrency, currencies } = useGlobalStore();

  const [tempCurrency, setTempCurrency] = useState<any>({ ...currency });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("保存选择货币:", tempCurrency);
      setCurrency(tempCurrency);
      await setUserCurrency(tempCurrency);
      window.location.href = "/m";
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
          size="sm"
          value={tempCurrency?.value ?? ""}
          onValueChange={(val) => {
            const selected = currencies.find((c) => c.value === val);

            setTempCurrency(selected);
          }}
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
