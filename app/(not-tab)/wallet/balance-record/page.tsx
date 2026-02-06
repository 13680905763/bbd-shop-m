"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@heroui/react";

import { useGlobalStore } from "@/store";
import { useWalletDetailList } from "@/hook/api";

export default function BalanceRecord() {
  const t = useTranslations("wallet.balanceRecord");
  const { currency } = useGlobalStore();
  const router = useRouter();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useWalletDetailList();

  const records = data?.pages?.flatMap((page: any) => page?.records) ?? [];

  const BalanceRecordContent = ({ records }: { records: any[] }) => {
    if (isLoading)
      return <Spinner className="flex h-[70vh] flex-col items-center" />;
    if (!records?.length)
      return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-lg text-gray-500">
          {t("noOrders")}
        </div>
      );

    return (
      <>
        {isFetching && !isFetchingNextPage && (
          <Spinner className="mb-2 flex justify-center text-gray-500" />
        )}
        <div className="flex flex-col gap-3">
          {records.map((r: any) => (
            <div key={r.id} className="rounded-lg bg-white px-2 py-3">
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-title !text-base font-medium">
                    {r?.bizReference}
                  </div>
                  <div className="text-sm text-gray-500">{r?.bizType}</div>
                  <div className="text-xs text-gray-400">{r?.updateTime}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-price-lg font-semibold">
                    {currency.symbol}
                    {r.amount}
                  </p>
                  <p className="text-sm">{r.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        >
          {!hasNextPage && (
            <div className="text-center text-[#999]">{t("noMoreRecords")}</div>
          )}
          {isFetchingNextPage && <Spinner />}
        </InfiniteScroll>
      </>
    );
  };

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="flex-1 overflow-auto p-2">
        <BalanceRecordContent records={records} />
      </div>
    </>
  );
}
