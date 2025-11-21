"use client";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { logoutCustomer } from "@/services";

export default function Settingpage() {
  const router = useRouter();
  const t = useTranslations("setting.page");

  const menu = [
    { key: "language", label: t("menuLanguage"), path: "/setting/language" },
    { key: "currency", label: t("menuCurrency"), path: "/setting/currency" },
    {
      key: "changePassword",
      label: t("menuChangePassword"),
      path: "/setting/changepwd",
    },
  ];
  const handleLogoutCustomer = async () => {
    try {
      await logoutCustomer();
      localStorage.removeItem("user-storage");
      window.location.reload();
    } catch {}
  };

  return (
    <div className="h-screen bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.push("/dashboard")}>
        {t("title")}
      </NavBar>
      <div className="p-2">
        <Listbox
          aria-label="User Menu"
          className="gap-0 divide-y divide-default-300/50 overflow-visible rounded-medium bg-content1 p-0 dark:divide-default-100/80"
          itemClasses={{
            base: "px-3 first:rounded-t-medium  last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
          }}
          onAction={(key) => router.push(key as string)}
        >
          {menu.map((item: any) => (
            <ListboxItem
              key={item.path}
              className="text-black"
              endContent={<IoChevronForwardSharp />}
            >
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>

        <Button
          className="mt-2 w-full"
          color="primary"
          onPress={handleLogoutCustomer}
        >
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}
