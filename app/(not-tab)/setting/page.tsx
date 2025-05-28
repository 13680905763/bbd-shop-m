"use client";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";

import { siteConfig } from "@/config/site";
import { getlogout } from "@/services/api/auth";

export default function Settingpage() {
  const router = useRouter();
  const logout = async () => {
    try {
      const res: any = await getlogout(); // 调用后端接口，带上 cookie

      res.success && router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.push("/dashboard")}>
        设置
      </NavBar>
      <div className="p-2">
        <Listbox
          aria-label="User Menu"
          className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1  overflow-visible  rounded-medium"
          itemClasses={{
            base: "px-3 first:rounded-t-medium  last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
          }}
          onAction={(key) => router.push(key as string)}
        >
          {siteConfig.setting.index.map((item) => (
            <ListboxItem
              key={item.path}
              className="text-black"
              endContent={<IoChevronForwardSharp />}
            >
              {item.title}
            </ListboxItem>
          ))}
        </Listbox>

        <Button className="w-full mt-2" color="primary" onPress={logout}>
          退出
        </Button>
      </div>
    </div>
  );
}
