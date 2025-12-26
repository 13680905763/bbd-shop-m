"use client";

import { Button, NumberInput } from "@heroui/react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoWallet } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import { createOrderByRecharge } from "@/services";
import { getWalletInfo } from "@/services/wallet";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useGlobalStore } from "@/store";

export default function WalletRechargePage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "wallet.page",
  });
  const { currency } = useGlobalStore();

  const [loading, setLoading] = useState(true);
  const [rechargeLoading, setRechargeLoading] = useState(false);

  const [currentPrice, setCurrentPrice] = useState<number>(1);
  const [wallet, setWallet] = useState<any>(null);

  const priceList = [50, 100, 200, 500, 1000, 5000];
  const router = useRouter();
  // 获取钱包信息
  const fetchWallet = async () => {
    try {
      const res = await getWalletInfo();

      setWallet(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleRecharge = async () => {
    try {
      setRechargeLoading(true);
      const bizCode: any = await createOrderByRecharge({
        currencyAmount: currentPrice,
        currencyCode: currency.value,
      });

      router.push(`/payment?bizCode=${bizCode}`);
    } catch (error) {
      setRechargeLoading(false);
    }
  };

  return (
    <>
      {loading && <FullscreenLoader />}
      <NavBar
        right={
          <button onClick={() => router.push("/wallet/balance-record")}>
            {t("record")}
          </button>
        }
        onBack={() => router.back()}
      >
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      <div className="flex-1 overflow-y-auto bg-[#f5f5f5] p-2">
        {/* 余额展示区域 */}
        <div className="box-card p-2 text-center">
          <div className="my-[10px] text-[24px] font-bold text-[#f3643a]">
            {currency.symbol}
            {wallet?.availabalBalance}
          </div>
          <div className="text-sm text-[#999]">{t("totalBalance")}</div>
          <div className="flex justify-center px-[10px] py-[15px]">
            <Button
              className="w-full rounded-full border-1 bg-white"
              variant="bordered"
              // onPress={() => router.push("/wallet/withdrawal")}
            >
              {t("withdraw")}
            </Button>
          </div>
        </div>

        {/* 快捷金额选择区域 */}
        <div>
          <div className="text-sm font-bold">{t("selectAmount")}</div>
          <div className="mx-auto my-2 grid grid-cols-3 grid-rows-2 gap-[5px]">
            {priceList.map((item) => (
              <button
                key={item}
                className={`flex cursor-pointer items-center justify-center rounded-[10px] bg-white py-3 ${
                  Number(currentPrice) === item
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
            isLoading={rechargeLoading}
            isDisabled={!currentPrice}
            onPress={handleRecharge}
          >
            {t("recharge")}
          </Button>
        </div>
      </div>
    </>
  );
}
