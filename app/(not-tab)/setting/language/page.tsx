"use client";

import React, { useState } from "react";
import { NavBar } from "antd-mobile";
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
          "inline-flex m-0 bg-transparent  items-center justify-between",
          "flex-row-reverse max-w-[100%] cursor-pointer px-4 py-4 ",
          "data-[selected=true]:bg-gray-50",
        ),
        label: "text-base font-medium text-gray-700",
      }}
    >
      {children}
    </Radio>
  );
};

export default function Settingpage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { language, setLanguage } = useGlobalStore();

  const [tempLanguage, setTempLanguage] = useState<string>(
    i18n.language || language,
  );
  const [loading, setLoading] = useState(false);

  const languages = [
    { label: "中文", value: "zh" },
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      setLanguage(tempLanguage);
      await i18n.changeLanguage(tempLanguage);
      window.location.href = "/";
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">
          {t("setting.languagePage.title")}
        </span>
      </NavBar>
      <div className="flex-1 space-y-6 bg-[#f5f5f5] p-4">
        <div className="rounded-xl bg-white shadow-sm">
          <RadioGroup
            className="w-full gap-0 p-0"
            value={tempLanguage}
            onValueChange={(val) => setTempLanguage(val as string)}
          >
            {languages.map((item) => (
              <CustomRadio key={item.value} value={item.value}>
                {item.label}
              </CustomRadio>
            ))}
          </RadioGroup>
        </div>

        <Button
          className="w-full"
          color="primary"
          isLoading={loading}
          size="lg"
          onPress={handleSubmit}
        >
          {t("setting.languagePage.save")}
        </Button>
      </div>
    </>
  );
}
