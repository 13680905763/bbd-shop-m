"use client";
import { Button, Input } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React from "react";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";

export default function Settingpage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        修改密码
      </NavBar>
      <div>
        <div className="box-card mx-2">
          {siteConfig.setting.changepwd.map((item) => (
            <Input
              key={item.placeholder}
              label={item.placeholder}
              size="sm"
              type="password"
            />
          ))}
        </div>
        <div className="m-2">
          <Button className="w-full " color="primary">
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}
