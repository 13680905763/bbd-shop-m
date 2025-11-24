"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@heroui/react";

import { useGlobalStore } from "@/store";
import { useWalletDetailList } from "@/hook";

function OrderCard({ record }: any) {
  const { currency } = useGlobalStore();

  return (
    <div className="mb-3 rounded-lg bg-white px-2 py-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-title !text-base font-medium">
            {record?.bizReference}
          </div>
          <div className="text-sm text-gray-500">{record?.bizType}</div>
          <div className="text-xs text-gray-400">{record?.updateTime}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-price-lg font-semibold">
            {currency.symbol}
            {record.amount}
          </p>
          <p className="text-sm">{record.status}</p>
        </div>
      </div>
    </div>
  );
}

export default function BalanceRecord() {
  const router = useRouter();
  const t = useTranslations("wallet.balanceRecord");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useWalletDetailList();

  const walletDetailList =
    data?.pages?.flatMap((page: any) => page?.records) ?? [];

  return (
    <div className="flex h-screen flex-col justify-between bg-[#f7f8f9]">
      <NavBar className="bg-white" onBack={() => router.back()}>
        {t("title")}
      </NavBar>

      <div className="flex-1 overflow-auto p-2">
        {walletDetailList.map((record: any) => (
          <OrderCard key={record.id} record={record} />
        ))}

        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={() => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && (
            <div
              style={{
                textAlign: "center",
                padding: "12px 0",
                color: "#999",
              }}
            >
              {t("noMoreRecords")}
            </div>
          )}
          {isFetchingNextPage && (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <div className="mb-2 text-lg">
                <Spinner />
              </div>
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
}
