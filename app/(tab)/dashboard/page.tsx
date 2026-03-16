"use client";
import { Avatar } from "@heroui/react";
import { IoChevronForwardSharp, IoSettings } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import { } from "@/hook/api";
import { FullscreenLoader } from "@/components/ui";
import { useWalletInfo } from "@/hook/api";
import { useUserInfo } from "@/hook/business";



export default function Dashboard() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { currency } = useGlobalStore();

  const { data: user, isLoading, error } = useUserInfo();


  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
  } = useWalletInfo();

  // 静态数据配置
  const menuItems = [
    {
      title: t("menuOrder"),
      src: "/m/images/dashboard/order.png",
      to: "/profile/order",
    },
    {
      title: t("menuWarehouse"),
      src: "/m/images/dashboard/warehouse.png",
      to: "/profile/warehouse",
    },
    {
      title: t("menuPackage"),
      src: "/m/images/dashboard/package.png",
      to: "/profile/package",
    },
  ];
  const inviteStats = [
    {
      title: t("TotalReward"),
      value: user?.myBonus || "0",
      to: "/promotion/bonus",
    },
    {
      title: t("inviteCount"),
      value: user?.inviteCount || "0",
      to: "/promotion/invitedUser",
    },
    {
      title: t("activeUsersCount"),
      value: user?.activeUsersCount || '0',
      // to: "/promotion/experience",
    },
  ];
  const serviceItems = [
    {
      title: t("servicesMessage"),
      src: "/m/images/dashboard/message.png",
      to: "/profile/message",
    },
    {
      title: t("servicesFavorite"),
      src: "/m/images/dashboard/favorite.png",
      to: "/profile/favorite",
    },
    {
      title: t("servicesAddress"),
      src: "/m/images/dashboard/address.png",
      to: "/profile/address",
    },
    {
      title: t("servicesBillingAddress"),
      src: "/m/images/dashboard/address.png",
      to: "/profile/billing-address",
    },
    {
      title: t("servicesHistory"),
      src: "/m/images/dashboard/history.png",
      to: "/profile/history",
    },
  ];

  if (isLoading || walletLoading) return <FullscreenLoader />;
  if (error || walletError) return <FullscreenLoader />;

  return (
    <div className="space-y-4 p-3">
      <div className="flex justify-between px-4">
        <button onClick={() => router.push("/profile")}>
          <div className="flex items-center gap-2 text-black">
            <Avatar className="h-[80px] w-[80px]" src={user?.avatarUrl} />
            <span className="text-lg font-bold">{user?.nickName}</span>
          </div>
        </button>
        <div className="flex items-center">
          <button onClick={() => router.push("/setting")}>
            <IoSettings className="h-[25px] w-[25px] text-black" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <button onClick={() => router.push("/wallet")}>
          <div className="text-xl font-bold">
            {currency.symbol}
            {wallet?.availabalBalance}
          </div>
          <div>{t("balance")}</div>
        </button>
        <button onClick={() => router.push("/wallet/points")}>
          <div className="text-xl font-bold"> {user?.myPoints}</div>
          <div>{t("points")}</div>
        </button>
      </div>

      <div className="home-card flex justify-between bg-[url('/m/images/coupon.png')] bg-cover bg-no-repeat py-2 pl-6 pr-2 text-white">
        <div className="items-center">
          <div className="my-1 text-sm font-bold">{t("coupon.title")}</div>
          <div className="text-xs">{t("coupon.available", { count: user?.couponCount || 0 })}</div>
        </div>
        <button
          className="flex items-center gap-2"
          onClick={() => router.push("/wallet/coupon")}
        >
          <span>{t("coupon.viewAll")}</span>
          <IoChevronForwardSharp />
        </button>
      </div>

      <div className="home-card grid grid-cols-3">
        {menuItems.map((item: any) => (
          <button key={item.title} onClick={() => router.push(item.to)}>
            <div className="flex flex-col items-center gap-2">
              <Avatar src={item.src} />
              <span>{item.title}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="home-card space-y-3 bg-[linear-gradient(89deg,_#ffe3df,_#e7f0f0)] px-2">
        <div className="flex items-center justify-between px-4">
          <div>
            <div className="font-bold">{t("inviteTitle")}</div>
          </div>
          <button onClick={() => router.push("/promotion")}>
            <IoChevronForwardSharp />
          </button>
        </div>
        <div className="home-card grid grid-cols-3">
          {inviteStats.map((item: any) => (
            <button key={item.title} onClick={() => router.push(item.to)}>
              <div className="text-xl font-bold">{item.value}</div>
              <div>{item.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="home-card space-y-2">
        <div className="px-4 font-bold">{t("servicesTitle")}</div>

        <div className="grid grid-cols-3 gap-2">
          {serviceItems.map((item: any) => (
            <button key={item.title} onClick={() => router.push(item.to)}>
              <div className="flex flex-col items-center gap-2">
                <Avatar className="bg-white" radius="md" src={item.src} />
                <span>{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
