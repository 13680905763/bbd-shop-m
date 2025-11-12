"use client";
import { InfiniteScroll, NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import React from "react";

import OrderCard from "./order-card";

import { useWalletDetailList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function BalanceRecord() {
  const router = useRouter();
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
      {isLoading && <FullscreenLoader />}

      <NavBar className="bg-white" onBack={() => router.back()}>
        余额记录
      </NavBar>
      <div className="flex-1 overflow-auto p-2">
        {walletDetailList.map((record: any) => (
          <OrderCard key={record.id} record={record} />
        ))}
        <InfiniteScroll
          hasMore={!!hasNextPage}
          loadMore={(isRetry) => fetchNextPage().then(() => undefined)}
        />
      </div>
    </div>
  );
}
