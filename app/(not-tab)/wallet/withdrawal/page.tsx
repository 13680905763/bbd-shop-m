"use client";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Button, Input, addToast } from "@heroui/react";

import { useGlobalStore } from "@/store";
import { useApplyWithdrawal, useWalletInfo, useWithdrawalList } from "@/hook/api";
import { BlockSpinner, EmptyState, FullscreenLoader } from "@/components/ui";
import { useTranslations } from "next-intl";
import { InfiniteScroll } from "antd-mobile";

export default function Settingpage() {
  const router = useRouter();
  const t = useTranslations("wallet.withdraw");
  const { currency } = useGlobalStore();
  const { applyWithdrawal, isApplying } = useApplyWithdrawal();
  const { data: wallet, isLoading } = useWalletInfo();
  const {
    data: withdrawalData,
    fetchNextPage,
    hasNextPage,
    isLoading: isHistoryLoading,
  } = useWithdrawalList();

  const [amount, setAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const feeRate = 0.01;
  const balance = wallet?.availabalBalance || 0;

  const { fee, finalAmount } = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      return { fee: 0, finalAmount: 0 };
    }
    const calculatedFee = num * feeRate;
    const calculatedFinalAmount = num - calculatedFee;
    return { fee: calculatedFee, finalAmount: calculatedFinalAmount };
  }, [amount]);

  const handleConfirm = async () => {
    if (!amount) {
      setErrorMessage(t("placeholder"));
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setErrorMessage(t("placeholder"));
      return;
    }
    applyWithdrawal({
      currencyAmount: num,
      currencyCode: currency.label,
    });

  };

  const handleMaxClick = () => {
    setAmount(balance.toString());
    setErrorMessage("");
  };

  const withdrawalList = withdrawalData?.pages?.flatMap((page: any) => page?.records) || [];

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>
      <div className="flex-1 overflow-auto p-4 scrollbar-hide">
        <div className="flex flex-col gap-4">
          <Input
            classNames={{
              input: "text-lg",
            }}
            endContent={
              <div className="flex items-center gap-2">
                <span className="text-small text-default-400">
                  {currency.label}
                </span>
                <button
                  className="cursor-pointer text-small font-medium text-primary outline-none transition-colors"
                  type="button"
                  onClick={handleMaxClick}
                >
                  Max
                </button>
              </div>
            }
            errorMessage={errorMessage}
            isInvalid={!!errorMessage}
            label={t("title")}
            placeholder={t("placeholder")}
            size="lg"
            type="number"
            value={amount}
            variant="bordered"
            onChange={(e) => {
              let val = e.target.value;

              if (parseFloat(val) > balance) {
                val = balance.toString();
              }
              setAmount(val);
              if (val) setErrorMessage("");
            }}
          />

          <div className="-mt-2 flex justify-end text-small text-default-500 bg-white p-2 rounded-medium">
            <span>
              {t("available")}:{" "}
              <span className="font-medium text-default-700">
                {currency.symbol}
                {balance}
              </span>
            </span>
          </div>

          <div className="rounded-medium bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-small text-default-500">{t("fee")}:</span>
              <span className="text-small font-medium ">
                -{currency.symbol}
                {fee.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-default-200 pt-2">
              <span className="font-semibold text-default-700">
                {t("receive")}:
              </span>
              <span className="text-xl  font-bold">
                {currency.symbol}
                {finalAmount.toFixed(2)}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1 rounded-lg text-sm text-[#f0700c]   ">
              <IoInformationCircleOutline className="h-4 w-4 flex-shrink-0" />
              <span>{t("tip")}</span>
            </div>
          </div>
          <Button
            color="primary"
            isLoading={isApplying}
            size="lg"
            onPress={handleConfirm}
          >
            {t("submit")}
          </Button>

          {/* 提现记录列表 */}
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-bold">{t("historyTitle")}</h3>
            {isHistoryLoading && <BlockSpinner />}
            {!isHistoryLoading && withdrawalList.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                {withdrawalList.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between border-b pb-2">
                      <span className="text-sm text-gray-500">
                        {item.createTime}
                      </span>
                      <span>
                        {item.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("amount")}:</span>
                        <span className="font-medium">
                          {currency.symbol}{item.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("fee")}:</span>
                        <span>
                          {currency.symbol}{item.feeAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t("actualAmount")}:</span>
                        <span className="font-bold text-primary">
                          {currency.symbol}{item.payAmount}
                        </span>
                      </div>
                      {item.remark && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 flex-shrink-0 mr-2">{t("remark")}:</span>
                          <span className="text-right text-gray-600 break-all">
                            {item.remark}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <InfiniteScroll
                  hasMore={!!hasNextPage}
                  loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
                >
                  {!hasNextPage && <EmptyState className="!h-auto" />}
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
