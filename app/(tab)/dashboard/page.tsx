"use client";
import { Avatar } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoChevronForwardSharp, IoSettings } from "react-icons/io5";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { getUserInfo } from "@/services";
import { getWalletInfo } from "@/services/wallet";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useGlobalStore } from "@/store";

export default function DashBoard() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { currency } = useGlobalStore();

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
    <div className="flex flex-1 flex-col overflow-auto p-3 scrollbar-hide">
      {loading && <FullscreenLoader />}
      <div className="flex justify-between px-4">
        <NextLink href="/profile">
          <div className="flex items-center gap-2 text-black">
            <Avatar className="h-[80px] w-[80px]" src={user?.avatarUrl} />
            <span className="text-lg font-bold">{user?.name}</span>
          </div>
        </NextLink>
        <div className="flex items-center">
          <NextLink href="/setting">
            <IoSettings className="h-[25px] w-[25px] text-black" />
          </NextLink>
        </div>
      </div>

      <div className="flex px-2 py-4">
        <NextLink
          className="flex flex-1 flex-col items-center justify-center"
          href="/wallet"
        >
          <div className="text-title-xl">
            {currency.symbol}
            {wallet?.availabalBalance}
          </div>
          <div>{t("balance")}</div>
        </NextLink>
        <NextLink
          className="flex flex-1 flex-col items-center justify-center"
          href="/wallet/points"
        >
          <div className="text-title-xl"> {user?.myPoints}</div>
          <div>{t("points")}</div>
        </NextLink>
      </div>

      <div className="box-card !mt-0 flex justify-between bg-[url('/m/images/coupon.png')] bg-cover bg-no-repeat py-2 pl-6 pr-2 text-white">
        <div className="items-center">
          <div className="my-1 text-sm font-bold">{t("coupon.title")}</div>
          <div className="text-xs">{t("coupon.available")}</div>
        </div>
        <div className="flex items-center gap-2">
          <span>{t("coupon.viewAll")}</span>
          <IoChevronForwardSharp />
        </div>
      </div>

      <div className="box-card flex py-3">
        {t.raw("menu").map((item: any) => (
          <button
            key={item.title}
            className="flex flex-1 flex-col items-center justify-center text-center"
            onClick={() => router.push(item.to)}
          >
            <div>
              <Avatar radius="md" size="sm" src={item.src} />
            </div>
            <p className="mt-3">{item.title}</p>
          </button>
        ))}
      </div>

      <div className="box-card bg-[linear-gradient(89deg,_#ffe3df,_#e7f0f0)] p-2">
        <div className="flex justify-between pl-6 pr-2">
          <div className="items-center">
            <div className="my-1 text-sm font-bold">{t("invite.title")}</div>
            <div className="text-xs">{t("invite.status")}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/promotion")}>
              <IoChevronForwardSharp />
            </button>
          </div>
        </div>
        <div className="box-card flex bg-white/50 px-2 py-4">
          {t.raw("invite.stats").map((item: any) => (
            <div
              key={item.title}
              className="flex flex-1 flex-col items-center justify-center"
            >
              <div className="text-title-xl">{item.value}</div>
              <div>{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="box-card p-3">
        <div className="my-1 pl-3 text-sm font-bold">{t("services.title")}</div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {t.raw("services.items").map((item: any) => (
            <button
              key={item.title}
              className="flex flex-1 flex-col items-center justify-center text-center"
              onClick={() => router.push(item.to)}
            >
              <div>
                <Avatar
                  className="bg-white"
                  radius="md"
                  size="sm"
                  src={item.src}
                />
              </div>
              <p className="mt-3">{item.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
