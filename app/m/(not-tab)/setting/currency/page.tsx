"use client";
import { NavBar } from "antd-mobile";
import React from "react";
import { RadioGroup } from "@heroui/react";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import CustomRadio from "@/components/custom-radio";

export default function Settingpage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        货币
      </NavBar>
      <div className="p-2">
        <RadioGroup className="w-full">
          {siteConfig.setting.currency.map((item) => (
            <CustomRadio key={item.title} value={item.title}>
              {item.title}
            </CustomRadio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
