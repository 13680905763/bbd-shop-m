"use client";
import { Avatar } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoChevronForwardSharp, IoSettings } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "@/services";
import { getWalletInfo } from "@/services/wallet";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function DashBoard() {
  const { t } = useTranslation("translation", { keyPrefix: "dashboard" });

  const router = useRouter();
  const { currency } = useGlobalStore();

  // 静态数据配置
  const menuItems = [
    {
      title: t("menuOrder"),
      src: "/images/dashboard/order.png",
      to: "/profile/order",
    },
    {
      title: t("menuWarehouse"),
      src: "/images/dashboard/warehouse.png",
      to: "/profile/warehouse",
    },
    {
      title: t("menuPackage"),
      src: "/images/dashboard/package.png",
      to: "/profile/package",
    },
  ];

  const inviteStats = [
    {
      title: t("inviteTotalReward"),
      value: "0",
      to: "/pages/member/account/index",
    },
    {
      title: t("inviteAffiliateBalance"),
      value: "0",
      to: "/pages/member/points/index",
    },
    {
      title: t("inviteWithdrawnAmount"),
      value: "0",
      to: "/pages/member/points/index",
    },
  ];

  const serviceItems = [
    {
      title: t("servicesMessage"),
      src: "/images/dashboard/message.png",
      to: "/profile/message",
    },
    {
      title: t("servicesFavorite"),
      src: "/images/dashboard/favorite.png",
      to: "/profile/favorite",
    },
    {
      title: t("servicesAddress"),
      src: "/images/dashboard/address.png",
      to: "/profile/address",
    },
    {
      title: t("servicesBillingAddress"),
      src: "/images/dashboard/address.png",
      to: "/profile/billing-address",
    },
    {
      title: t("servicesHistory"),
      src: "/images/dashboard/history.png",
      to: "/profile/history",
    },
  ];

  // ✅ 页面加载状态
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, walletRes]: any = await Promise.all([
          getUserInfo(),
          getWalletInfo(),
        ]);

        setUser(userRes);
        setWallet(walletRes);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-auto pb-[env(safe-area-inset-bottom)]">
      {loading && <FullscreenLoader />}

      {/* 顶部用户信息 */}
      <div className="flex items-center justify-between py-2">
        <div role="button" onClick={() => router.push("/profile")}>
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16" src={user?.avatarUrl} />
            <span className="text-xl font-bold text-gray-900">
              {user?.nickName}
            </span>
          </div>
        </div>
        <div role="button" onClick={() => router.push("/setting")}>
          <IoSettings className="h-6 w-6 text-gray-700" />
        </div>
      </div>

      {/* 资产概览 */}
      <div className="flex py-2">
        <div
          className="flex flex-1 flex-col items-center justify-center"
          role="button"
          onClick={() => router.push("/wallet")}
        >
          <div className="dashboard-stat-value text-2xl text-[#f0700c]">
            {currency.symbol}
            {wallet?.availabalBalance}
          </div>
          <div className="dashboard-stat-label">{t("balance")}</div>
        </div>
        <div className="h-8 w-[1px] self-center bg-gray-200" />
        <div
          className="flex flex-1 flex-col items-center justify-center"
          role="button"
          onClick={() => router.push("/wallet/points")}
        >
          <div className="dashboard-stat-value text-2xl text-[#f0700c]">
            {user?.myPoints}
          </div>
          <div className="dashboard-stat-label">{t("points")}</div>
        </div>
      </div>

      {/* 优惠券卡片 */}
      <div className="box-card flex justify-between overflow-hidden bg-[url('/images/coupon.png')] bg-cover bg-no-repeat px-4 py-2 text-white shadow-md">
        <div>
          <div className="text-base font-bold">{t("coupon.title")}</div>
          <div className="text-xs opacity-90">{t("coupon.available")}</div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span>{t("coupon.viewAll")}</span>
          <IoChevronForwardSharp />
        </div>
      </div>

      {/* 核心菜单 */}
      <div className="box-card flex py-2 shadow-sm">
        {menuItems.map((item) => (
          <button
            key={item.title}
            className="dashboard-icon-btn"
            onClick={() => router.push(item.to)}
          >
            <Avatar className="h-10 w-10 bg-transparent" src={item.src} />
            <span className="mt-2 text-xs font-medium text-gray-700">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {/* 邀请卡片 */}
      <div className="box-card overflow-hidden !bg-gradient-to-r from-[#ffe3df] to-[#e7f0f0] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="dashboard-card-title">{t("inviteTitle")}</div>
            <div className="dashboard-card-subtitle mt-0.5">
              {t("inviteStatus")}
            </div>
          </div>
          <button
            className="flex items-center justify-center rounded-full bg-white/80 p-1.5 shadow-sm"
            onClick={() => router.push("/promotion")}
          >
            <IoChevronForwardSharp className="text-gray-600" />
          </button>
        </div>

        <div className="mx-2 mb-2 flex rounded-lg bg-white/60 py-3 backdrop-blur-sm">
          {inviteStats.map((item, index) => (
            <React.Fragment key={item.title}>
              <div className="flex flex-1 flex-col items-center justify-center">
                <div className="dashboard-stat-value text-base">
                  {item.value}
                </div>
                <div className="dashboard-stat-label">{item.title}</div>
              </div>
              {index < inviteStats.length - 1 && (
                <div className="h-6 w-[1px] self-center bg-gray-200/50" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 更多服务 */}
      <div className="box-card p-4">
        <div className="dashboard-card-title mb-4 pl-1">
          {t("servicesTitle")}
        </div>
        <div className="grid grid-cols-4 gap-y-6">
          {serviceItems.map((item) => (
            <button
              key={item.title}
              className="dashboard-icon-btn"
              onClick={() => router.push(item.to || "")}
            >
              <Avatar
                className="bg-transparent"
                radius="md"
                size="sm"
                src={item.src}
              />
              <span className="mt-2 text-xs text-gray-600">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
