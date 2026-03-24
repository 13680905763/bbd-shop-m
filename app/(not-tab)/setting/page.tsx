"use client";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { useLogoutFlow } from "@/hook/business";

export default function Settingpage() {
  const router = useRouter();
  const t = useTranslations("setting.page");
  const { logout, isLoggingOut } = useLogoutFlow();

  const menu = [
    { key: "language", label: t("menuLanguage"), path: "/setting/language" },
    { key: "currency", label: t("menuCurrency"), path: "/setting/currency" },
    {
      key: "changePassword",
      label: t("menuChangePassword"),
      path: "/setting/changepwd",
    },
  ];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.push("/dashboard")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 space-y-2 p-2">
        <Listbox
          aria-label="Menu"
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
          className="w-full"
          color="primary"
          isLoading={isLoggingOut}
          onPress={() => logout()}
        >
          {t("logout")}
        </Button>
      </div>
    </>
  );
}
