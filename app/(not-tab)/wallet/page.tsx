"use client";

import { Button, NumberInput } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoWallet } from "react-icons/io5";
import { useTranslations } from "next-intl";

import { walletApi } from "@/services/walletApi";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useGlobalStore } from "@/store";
import { useWalletInfo } from "@/hook/api";
import { createOrderByRecharge } from "@/services";

export default function WalletRechargePage() {
  const t = useTranslations("wallet.page"); // ✅ 命名空间
  const { currency } = useGlobalStore();

  const { data: wallet, isLoading, error } = useWalletInfo();
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number>(1);

  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();

  const handleRecharge = async () => {
    try {
      setRechargeLoading(true);
      // const res = await createOrderByRecharge({
      //   amount: currentPrice,
      //   payType: "PAYPAL",
      //   returnUrl: window.location.origin + "/payment/result?paymentMethod=PAYPAL",
      // });
      const bizCode: any = await createOrderByRecharge({
        currencyAmount: Number(currentPrice),
        currencyCode: currency.label,
      });
      router.push(`/payment/${bizCode}`);
      // const res: any = await walletApi.payPaypel(
      //   `amount=${currentPrice}&returnUrl=${window.location.origin + "/payment/result?paymentMethod=PAYPAL"}`,
      // );

      // console.log("res", res);

      // window.location.href = res.payUrl;
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
            className="w-full button-default"
            isDisabled
          // onPress={() => router.push("/wallet/withdrawal")}
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
                className={`flex items-center justify-center rounded-lg bg-white py-3 ${Number(currentPrice) === item
                  ? "border border-orange-500 font-semibold text-orange-600"
                  : ""
                  }`}
                onClick={() => setCurrentPrice(item)}
              >
                {currency.symbol} {item}
              </button>
            ))}
          </div>
        </div>

        {/* 自定义金额输入区域 */}
        <div>
          <div className="text-sm font-bold">{t("otherAmount")}</div>
          <NumberInput
            className="my-2"
            classNames={{ inputWrapper: "bg-white" }}
            minValue={1}
            placeholder={t("enterOtherAmount")}
            size="lg"
            startContent={<IoWallet className="h-6 w-6" />}
            type="number"
            value={currentPrice}
            onValueChange={(value) => setCurrentPrice(value)}
          />
          <Button
            className="w-full"
            color="primary"
            isDisabled={!currentPrice}
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
