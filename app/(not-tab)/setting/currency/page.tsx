"use client";

import { NavBar } from "antd-mobile";
import React, { useState } from "react";
import { Radio, RadioGroup, cn, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useGlobalStore } from "@/store";

const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;
  
    return (
      <Radio
        size="sm"
        {...otherProps}
        classNames={{
          base: cn(
            "inline-flex m-0 bg-transparent hover:bg-gray-50 items-center justify-between",
            "flex-row-reverse max-w-[100%] cursor-pointer px-4 py-4 border-b border-gray-50 last:border-none",
            "data-[selected=true]:bg-gray-50",
          ),
          label: "text-base font-medium text-gray-700",
        }}
      >
        {children}
      </Radio>
    );
  };
  
  export default function CurrencySettingPage() {
    const { t } = useTranslation(); // ✅ 使用 react-i18next
    const router = useRouter();
    const { currency, setCurrency, currencies } = useGlobalStore();
  
    const [tempCurrency, setTempCurrency] = useState<any>({ ...currency });
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async () => {
      setLoading(true);
      try {
        console.log("保存选择货币:", tempCurrency);
        setCurrency(tempCurrency);
        // await setUserCurrency(tempCurrency);
        window.location.href = "/m";
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex min-h-[calc(100vh-env(safe-area-inset-top))] flex-col bg-[#f5f5f5]">
        <NavBar className="border-b border-gray-100 bg-white" onBack={() => router.back()}>
          <span className="text-lg font-bold text-gray-900">{t("setting.currencyPage.title")}</span>
        </NavBar>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <RadioGroup
              className="w-full p-0"
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
          </div>
  
          <Button
            className="h-12 w-full rounded-xl bg-primary font-medium text-white shadow-sm shadow-primary/20"
            isLoading={loading}
            onPress={handleSubmit}
          >
            {t("setting.currencyPage.save")}
          </Button>
        </div>
      </div>
    );
  }
