"use client";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { NavBar } from "antd-mobile";
import React from "react";
import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next"; // 改用 react-i18next

export default function Settingpage() {
  const router = useRouter();
  const { t } = useTranslation("translation", { keyPrefix: "setting.page" });
  const menu = [
    {
      key: "language",
      label: t("menuLanguage"),
      path: "/setting/language",
    },
    {
      key: "currency",
      label: t("menuCurrency"),
      path: "/setting/currency",
    },
    {
      key: "changePassword",
      label: t("menuChangePassword"),
      path: "/setting/changepwd",
    },
  ];

  const handleLogoutCustomer = async () => {
    router.push("/login");
  };

  return (
    <>
      {/* 导航栏 - 固定在顶部 */}
      <NavBar onBack={() => router.push("/dashboard")}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      {/* 主要内容区域 */}
      <div className="flex-1 space-y-6 bg-[#f5f5f5] p-4">
        {/* 设置菜单 */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <Listbox
            aria-label="Settings Menu"
            className="p-0"
            itemClasses={{
              base: "px-4 py-4 data-[hover=true]:bg-gray-50 border-b border-gray-50 last:border-none transition-colors",
            }}
            onAction={(key) => router.push(key as string)}
          >
            {menu.map((item) => (
              <ListboxItem
                key={item.path}
                endContent={
                  <IoChevronForwardSharp className="text-lg text-gray-300" />
                }
                textValue={item.label}
              >
                <span className="text-base font-medium text-gray-700">
                  {item.label}
                </span>
              </ListboxItem>
            ))}
          </Listbox>
        </div>

        {/* 退出登录按钮 */}
        <Button
          className="w-full"
          color="primary"
          size="lg"
          startContent={
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          }
          onPress={handleLogoutCustomer}
        >
          {t("logout")}
        </Button>

        {/* 版本信息 */}
        <div className="py-4 text-center">
          <p className="text-xs text-gray-400">{t("version")} 1.0.0</p>
          <p className="mt-1 text-xs text-gray-300">© 2024 BBD Shop</p>
        </div>
      </div>
    </>
  );
}
