"use client";

import { Button, Input } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useGlobalStore } from "@/store";
import { useWalletInfo } from "@/hook/api";
import { createOrderByRecharge } from "@/services";

/** 将逗号视为小数点，解析为数字 */
function parsePrice(value: string): number {
  // 将逗号替换为点后解析
  const normalized = value.replace(/,/g, ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

export default function WalletRechargePage() {
  const t = useTranslations("wallet.page"); // ✅ 命名空间
  const { currency } = useGlobalStore();

  const { data: wallet, isLoading, error } = useWalletInfo();
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<string>("1");

  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();

  /** 处理输入：只允许数字、小数点和逗号，且最多一个小数分隔符 */
  const handlePriceChange = (value: string) => {
    // 允许清空
    if (value === "") {
      setCurrentPrice("");
      return;
    }
    // 只保留数字、点、逗号
    const cleaned = value.replace(/[^0-9.,]/g, "");
    // 将逗号统一视为小数点，检查最多只有一个小数分隔符
    const normalized = cleaned.replace(/,/g, ".");
    const parts = normalized.split(".");
    if (parts.length > 2) return; // 超过一个小数分隔符，不更新
    setCurrentPrice(cleaned);
  };

  const handleRecharge = async () => {
    const amount = parsePrice(currentPrice);
    if (amount < 1) return;
    try {
      setRechargeLoading(true);
      const bizCode: any = await createOrderByRecharge({
        currencyAmount: amount,
        currencyCode: currency.label,
      });

      router.push(`/payment/${bizCode}`);
    } catch (error) {
      setRechargeLoading(false);
    }
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar
        className="bg-white"
        right={
          <button onClick={() => router.push("/wallet/balance-record")}>
            {t("record")}
          </button>
        }
        onBack={() => router.back()}
      >
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="flex-1 space-y-4 px-2">
        {/* 余额展示区域 */}
        <div className="home-card mt-2 space-y-2 px-2 text-center">
          <div className="text-sm tracking-wide text-gray-500">
            {t("totalBalance")}
          </div>
          <div className="text-balance">
            {currency.symbol}
            {wallet?.availabalBalance}
          </div>
          <Button
            className="button-default w-full"
            onPress={() => router.push("/wallet/withdrawal")}
          >
            {t("withdraw")}
          </Button>
        </div>

        {/* 快捷金额选择区域 */}
        <div>
          <div className="text-sm font-bold">{t("selectAmount")}</div>
          <div className="mx-auto my-2 grid grid-cols-3 grid-rows-2 gap-[5px]">
            {priceList.map((item) => (
              <button
                key={item}
                className={`flex items-center justify-center rounded-lg bg-white py-3 ${
                  parsePrice(currentPrice) === item
                    ? "border border-orange-500 font-semibold text-orange-600"
                    : ""
                }`}
                onClick={() => setCurrentPrice(String(item))}
              >
                {currency.symbol} {item}
              </button>
            ))}
          </div>
        </div>

        {/* 自定义金额输入区域 */}
        <div>
          <div className="text-sm font-bold">{t("otherAmount")}</div>
          <Input
            className="my-2"
            classNames={{ inputWrapper: "bg-white" }}
            inputMode="decimal"
            placeholder={t("enterOtherAmount")}
            size="lg"
            startContent={<IoWallet className="h-6 w-6" />}
            value={currentPrice}
            onValueChange={handlePriceChange}
          />
          <Button
            className="w-full"
            color="primary"
            isDisabled={!currentPrice || parsePrice(currentPrice) < 1}
            isLoading={rechargeLoading}
            onPress={handleRecharge}
          >
            {t("recharge")}
          </Button>
        </div>
      </div>
    </>
  );
}

