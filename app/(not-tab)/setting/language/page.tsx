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
      router.push("/");
      // window.location.reload();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")} {/* 语言 */}
      </NavBar>
      <div className="flex flex-col gap-4 p-2">
        <RadioGroup
          className="w-full"
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
          {t("save")} {/* 保存 */}
        </Button>
      </div>
    </div>
  );
}
