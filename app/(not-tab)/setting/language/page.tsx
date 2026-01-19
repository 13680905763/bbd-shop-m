"use client";

import React, { useState } from "react";
import { NavBar } from "antd-mobile";
import { Radio, RadioGroup, cn, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"; // ✅ 翻译钩子

import { languages } from "@/i18n/config";
import { setUserLocale } from "@/i18n/service";
import { useGlobalStore } from "@/store";

const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      size="sm"
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-transparent items-center justify-between",
          "flex-row-reverse max-w-[100%] cursor-pointer rounded-lg p-3 ",
          "data-[selected=true]:bg-gray-50",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default function Settingpage() {
  const t = useTranslations("setting.languagePage"); // ✅ 命名空间建议叫 Setting
  const router = useRouter();
  const { language, setLanguage } = useGlobalStore();

  const [tempLanguage, setTempLanguage] = useState<string>(language);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("保存选择语言:", tempLanguage);
      setLanguage(tempLanguage);
      await setUserLocale(tempLanguage);
      window.location.href = "/m";
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 space-y-2 p-2">
        <RadioGroup
          className="w-full bg-white"
          value={tempLanguage}
          onValueChange={(val) => setTempLanguage(val as string)}
        >
          {languages.map((item) => (
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
    </>
  );
}
